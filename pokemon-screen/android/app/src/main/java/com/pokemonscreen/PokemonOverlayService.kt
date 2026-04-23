package com.pokemonscreen

import android.app.*
import android.content.*
import android.graphics.*
import android.hardware.*
import android.media.MediaPlayer
import android.os.*
import android.view.*
import android.widget.PopupMenu
import androidx.core.app.NotificationCompat
import kotlin.math.sin
import kotlin.math.sqrt

class PokemonOverlayService : Service(), SensorEventListener {
    private lateinit var windowManager: WindowManager
    private var movie: Movie? = null
    private var lastTick: Long = 0
    private var mediaPlayer: MediaPlayer? = null
    private lateinit var sensorManager: SensorManager
    private var stepSensor: Sensor? = null
    private var accelSensor: Sensor? = null
    
    private var currentSteps = 0
    private var isHatched = false
    private var level = 1
    private var selectedPokemon = "totodile"
    private var candies = 0
    private var isVisible = true
    private var isPressed = false
    private val stepsPerCandy = 50
    private val scaleFactor = 3.2f

    private var lastShakeTime: Long = 0
    private val SHAKE_THRESHOLD = 11.0f
    private val SHAKE_COOLDOWN = 300

    private var posX = 0f
    private var posY = 500f
    private var velX = 1.2f
    private var velY = 0.8f
    private var screenWidth = 0
    private var screenHeight = 0
    private var pauseUntil = 0L

    private class Particle(var x: Float, var y: Float, var vx: Float, var vy: Float, var life: Int, var color: Int)
    private val particles = mutableListOf<Particle>()
    private val random = java.util.Random()

    companion object {
        private var activeOverlay: View? = null
        private const val CHANNEL_ID = "pokemon_overlay_channel"
        private const val NOTIFICATION_ID = 1
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, createNotification())

        loadData()
        isVisible = true
        activeOverlay?.visibility = View.VISIBLE

        intent?.getIntExtra("addSteps", 0)?.let { extra ->
            if (extra > 0) addSteps(extra)
        }

        intent?.getStringExtra("pokemon")?.let { newPoke ->
            if (newPoke != selectedPokemon) {
                selectedPokemon = newPoke
                loadMovies()
                activeOverlay?.postInvalidate()
            }
        }
        
        loadMovies()
        return START_STICKY
    }

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        loadData()
        
        val metrics = resources.displayMetrics
        screenWidth = metrics.widthPixels
        screenHeight = metrics.heightPixels

        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        stepSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR)
        stepSensor?.let { sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_FASTEST) }
        
        accelSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        accelSensor?.let { sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME) }
        
        showOverlay()
    }

    private fun loadData() {
        val prefs = getSharedPreferences("pokemon_prefs", Context.MODE_PRIVATE)
        selectedPokemon = prefs.getString("selectedPokemon", "totodile") ?: "totodile"
        currentSteps = prefs.getInt("${selectedPokemon}_steps", 0)
        level = prefs.getInt("${selectedPokemon}_level", 1)
        isHatched = prefs.getBoolean("${selectedPokemon}_isHatched", false)
        candies = prefs.getInt("global_candies", 0)
    }

    private fun saveData() {
        val prefs = getSharedPreferences("pokemon_prefs", Context.MODE_PRIVATE)
        prefs.edit().apply {
            putInt("${selectedPokemon}_steps", currentSteps)
            putInt("${selectedPokemon}_level", level)
            putBoolean("${selectedPokemon}_isHatched", isHatched)
            putString("selectedPokemon", selectedPokemon)
            putInt("global_candies", candies)
            apply()
        }
    }

    private fun triggerBurst() {
        val colors = intArrayOf(Color.WHITE, Color.YELLOW, Color.CYAN, Color.MAGENTA)
        for (i in 0 until 30) {
            val angle = random.nextFloat() * 2 * Math.PI.toFloat()
            val speed = random.nextFloat() * 15f + 5f
            particles.add(Particle(
                30f * scaleFactor, 
                40f * scaleFactor, 
                Math.cos(angle.toDouble()).toFloat() * speed, 
                Math.sin(angle.toDouble()).toFloat() * speed, 
                40, 
                colors[random.nextInt(colors.size)]
            ))
        }
    }

    private fun addSteps(count: Int) {
        val oldSteps = currentSteps
        currentSteps += count
        
        val newCandies = (currentSteps / stepsPerCandy) - (oldSteps / stepsPerCandy)
        if (newCandies > 0) candies += newCandies

        if (!isHatched && currentSteps >= 100) { 
            isHatched = true
            triggerBurst()
            playCry()
        }
        
        val oldLevelBase = oldSteps / 100
        val newLevelBase = currentSteps / 100
        if (isHatched && newLevelBase > oldLevelBase) {
            level += (newLevelBase - oldLevelBase)
        }
        saveData()
    }

    private fun loadMovies() {
        try {
            val id = resources.getIdentifier(selectedPokemon, "raw", packageName)
            movie = if (id != 0) Movie.decodeStream(resources.openRawResource(id)) else null
        } catch (e: Exception) { e.printStackTrace() }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(CHANNEL_ID, "Pokemon Overlay", NotificationManager.IMPORTANCE_LOW)
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    private fun createNotification(): Notification {
        val intent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE)
        
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Pokemon Screen")
            .setContentText("Partner is exploring with you")
            .setSmallIcon(resources.getIdentifier("ic_launcher", "mipmap", packageName))
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()
    }

    private fun playCry() {
        try {
            mediaPlayer?.release()
            val cryRes = resources.getIdentifier("${selectedPokemon}_cry", "raw", packageName)
            if (cryRes != 0) {
                mediaPlayer = MediaPlayer.create(this, cryRes); mediaPlayer?.start()
            }
        } catch (e: Exception) {}
    }

    private fun showOverlay() {
        activeOverlay?.let { try { windowManager.removeView(it) } catch(e: Exception) {} }

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT, WindowManager.LayoutParams.WRAP_CONTENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        )
        params.gravity = Gravity.TOP or Gravity.LEFT
        params.x = screenWidth / 2; params.y = screenHeight / 2

        val v = object : View(this) {
            val viewRef = this
            val detector = GestureDetector(context, object : GestureDetector.SimpleOnGestureListener() {
                override fun onLongPress(e: MotionEvent) { showMenu(viewRef) }
                override fun onSingleTapConfirmed(e: MotionEvent): Boolean {
                    if (isHatched) { 
                        playCry()
                        pauseUntil = SystemClock.uptimeMillis() + 5000
                        viewRef.animate().translationYBy(-100f).setDuration(150).withEndAction { viewRef.animate().translationYBy(100f).setDuration(150).start() }.start() 
                    }
                    return true
                }
            })
            override fun onTouchEvent(event: MotionEvent): Boolean {
                if (event.action == MotionEvent.ACTION_DOWN) isPressed = true
                if (event.action == MotionEvent.ACTION_UP || event.action == MotionEvent.ACTION_CANCEL) isPressed = false
                return detector.onTouchEvent(event)
            }
            override fun onDraw(canvas: Canvas) {
                val now = SystemClock.uptimeMillis()
                if (lastTick == 0L) lastTick = now
                canvas.save()
                
                // Centrar dibujo en el área medida (20px de offset)
                canvas.translate(10f * scaleFactor, 10f * scaleFactor)

                if (isHatched) {
                    canvas.scale(scaleFactor, scaleFactor)
                    movie?.let { m ->
                        if (velX > 0) canvas.scale(-1f, 1f, m.width() / 2f, 0f)
                        m.setTime(((now - lastTick) % m.duration().coerceAtLeast(1)).toInt())
                        // Ajustar Pokémon si son muy grandes moviendo el canvas
                        var offsetY = 0f
                        val bigOnes = listOf("onix", "ho_oh", "steelix", "gyarados", "lugia", "tyranitar", "charizard", "dragonite", "venusaur", "blastoise", "articuno", "zapdos", "moltres", "mewtwo")
                        if (bigOnes.contains(selectedPokemon)) {
                            offsetY = -12f
                        }
                        m.draw(canvas, 0f, offsetY)
                    }
                } else {
                    canvas.scale(scaleFactor, scaleFactor)
                    val angle = (Math.sin(now / 150.0) * 15.0).toFloat()
                    canvas.rotate(angle, 15f, 40f) 
                    val p = Paint().apply { isAntiAlias = true }
                    p.color = Color.parseColor("#E5E7EB"); canvas.drawOval(2f, 2f, 32f, 42f, p)
                    p.color = Color.WHITE; canvas.drawOval(0f, 0f, 30f, 40f, p)
                    p.color = Color.parseColor("#10B981")
                    canvas.drawCircle(8f, 12f, 4f, p); canvas.drawCircle(20f, 22f, 3f, p); canvas.drawCircle(12f, 30f, 2.5f, p)
                }
                canvas.restore()

                // Dibujar partículas fuera del escalado del Pokémon
                val iterator = particles.iterator()
                val pPaint = Paint()
                while (iterator.hasNext()) {
                    val part = iterator.next()
                    pPaint.color = part.color
                    pPaint.alpha = (part.life * 255 / 40).coerceIn(0, 255)
                    canvas.drawCircle(part.x, part.y, 6f, pPaint)
                    part.x += part.vx
                    part.y += part.vy
                    part.vy += 0.5f // Gravedad
                    part.life--
                    if (part.life <= 0) iterator.remove()
                }

                invalidate()
            }
            override fun onMeasure(specW: Int, specH: Int) {
                // Dar mucho más espacio (40px extra) para evitar cortes en animaciones
                val w = if (isHatched && movie != null) movie!!.width() else 40
                val h = if (isHatched && movie != null) movie!!.height() else 50
                setMeasuredDimension(((w + 40) * scaleFactor).toInt(), ((h + 40) * scaleFactor).toInt())
            }
        }
        activeOverlay = v
        windowManager.addView(v, params)
        startSmoothAnimation(params)
    }

    private fun showMenu(view: View) {
        val popup = PopupMenu(this, view)
        popup.menu.add("Desinvocar").setOnMenuItemClickListener { isVisible = false; view.visibility = View.GONE; true }
        popup.show()
    }

    private fun startSmoothAnimation(params: WindowManager.LayoutParams) {
        val choreographer = Choreographer.getInstance()
        choreographer.postFrameCallback(object : Choreographer.FrameCallback {
            override fun doFrame(frameTimeNanos: Long) {
                activeOverlay?.let { view ->
                    if (isVisible && !isPressed && SystemClock.uptimeMillis() > pauseUntil) {
                        val currentVelX = if (isHatched) velX else velX / 3f
                        val currentVelY = if (isHatched) velY else velY / 3f
                        posX += currentVelX; posY += currentVelY
                        if (posX <= 0 || posX + view.width >= screenWidth) velX *= -1
                        if (posY <= 100 || posY + view.height >= screenHeight - 100) velY *= -1
                        params.x = posX.toInt(); params.y = posY.toInt()
                        if (view.isAttachedToWindow) windowManager.updateViewLayout(view, params)
                    }
                    choreographer.postFrameCallback(this)
                }
            }
        })
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event == null) return
        if (event.sensor.type == Sensor.TYPE_STEP_DETECTOR) {
            addSteps(1)
        } else if (event.sensor.type == Sensor.TYPE_ACCELEROMETER) {
            val x = event.values[0]; val y = event.values[1]; val z = event.values[2]
            val acceleration = sqrt(x * x + y * y + z * z) - SensorManager.GRAVITY_EARTH
            val now = System.currentTimeMillis()
            if (acceleration > SHAKE_THRESHOLD && now - lastShakeTime > SHAKE_COOLDOWN) {
                lastShakeTime = now; addSteps(1)
            }
        }
    }

    override fun onAccuracyChanged(s: Sensor?, a: Int) {}
    override fun onDestroy() { 
        super.onDestroy()
        activeOverlay?.let { if (it.isAttachedToWindow) windowManager.removeView(it) }
        sensorManager.unregisterListener(this) 
    }
}

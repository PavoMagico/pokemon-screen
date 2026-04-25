package com.pokemonscreen

import android.app.*
import android.content.*
import android.content.pm.ServiceInfo
import android.content.res.Configuration
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
    private var velocityTracker: VelocityTracker? = null
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
    private var lastCryTime = 0L
    private val stepsPerCandy = 50
    private val scaleFactor = 3.2f

    private var lastShakeTime: Long = 0
    private val SHAKE_THRESHOLD = 11.0f
    private val SHAKE_COOLDOWN = 300

    private var posX = 0f
    private var posY = 500f
    private var velX = 1.2f
    private var velY = 0.8f
    private var initialX = 0f
    private var initialY = 0f
    private var initialTouchX = 0f
    private var initialTouchY = 0f
    private var isDragging = false
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

    private fun registerSensors() {
        try {
            sensorManager.unregisterListener(this)
            stepSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR)
            stepSensor?.let { sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_FASTEST) }
            
            accelSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
            accelSensor?.let { sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME) }
        } catch (e: Exception) { e.printStackTrace() }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        createNotificationChannel()
        
        val notification = createNotification()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_HEALTH)
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }

        val pokemonNameFromIntent = intent?.getStringExtra("pokemon")
        if (pokemonNameFromIntent != null) {
            if (pokemonNameFromIntent != selectedPokemon) {
                saveData()
                selectedPokemon = pokemonNameFromIntent
                loadData()
                loadMovies()
            } else {
                loadMovies() // Asegurar carga incluso si el nombre coincide
            }
        } else {
            loadData()
            loadMovies()
        }

        registerSensors()
        isVisible = true
        pauseUntil = 0L
        lastTick = SystemClock.uptimeMillis() // Inicializar con el tiempo actual en lugar de 0L

        activeOverlay?.let { view ->
            view.visibility = View.VISIBLE
            view.animate().cancel()
            view.translationY = 0f
            
            // Forzar redibujo inmediato
            view.postInvalidate()

            // Animación de aparición (siempre, para consistencia)
            view.alpha = 0f
            view.scaleX = 0.5f
            view.scaleY = 0.5f
            view.animate()
                .alpha(1f)
                .scaleX(1f)
                .scaleY(1f)
                .setDuration(400)
                .start()
        }

        intent?.getIntExtra("addSteps", 0)?.let { extra ->
            if (extra > 0) addSteps(extra)
        }
        
        return START_STICKY
    }

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        
        loadData()
        updateScreenSize()
        showOverlay()
    }

    private fun updateScreenSize() {
        val metrics = resources.displayMetrics
        screenWidth = metrics.widthPixels
        screenHeight = metrics.heightPixels
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        updateScreenSize()
        // Reposicionar si queda fuera tras rotación, considerando el padding interno
        activeOverlay?.let { view ->
            val spriteW = (if (isHatched && movie != null) movie!!.width().toFloat() else 30f) * scaleFactor
            val paddingX = 10f * scaleFactor
            if (posX + paddingX + spriteW > screenWidth) {
                posX = screenWidth - paddingX - spriteW
            }
            if (posY + view.height > screenHeight) {
                posY = (screenHeight - view.height).toFloat().coerceAtLeast(0f)
            }
        }
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
        // Cargamos los caramelos reales antes de guardar para no pisar cambios de la UI
        val globalCandies = prefs.getInt("global_candies", candies)
        prefs.edit().apply {
            putInt("${selectedPokemon}_steps", currentSteps)
            putInt("${selectedPokemon}_level", level)
            putBoolean("${selectedPokemon}_isHatched", isHatched)
            putInt("global_candies", globalCandies)
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
        val prefs = getSharedPreferences("pokemon_prefs", Context.MODE_PRIVATE)
        candies = prefs.getInt("global_candies", 0)
        
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
            if (id != 0) {
                val inputStream = resources.openRawResource(id)
                val bytes = inputStream.readBytes()
                movie = Movie.decodeByteArray(bytes, 0, bytes.size)
                inputStream.close()
            } else {
                movie = null
            }
        } catch (e: Exception) {
            e.printStackTrace()
            movie = null
        }
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
        try {
            activeOverlay?.let { 
                if (it.isAttachedToWindow) windowManager.removeViewImmediate(it) 
            }
        } catch(e: Exception) {}
        activeOverlay = null

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT, WindowManager.LayoutParams.WRAP_CONTENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        )
        params.gravity = Gravity.TOP or Gravity.LEFT
        
        // Sincronizar posición inicial
        posX = (screenWidth / 2f) - (50f * scaleFactor)
        posY = (screenHeight / 2f)
        params.x = posX.toInt()
        params.y = posY.toInt()

        val v = object : View(this) {
            val viewRef = this
            private var tapCount = 0
            private var firstTapTime = 0L
            private val longPressHandler = Handler(Looper.getMainLooper())
            private val longPressRunnable = Runnable {
                if (isPressed && !isDragging && isVisible) {
                    showMenu(viewRef)
                }
            }
            
            init {
                setLayerType(LAYER_TYPE_SOFTWARE, null)
            }

            private fun handleTap() {
                val now = SystemClock.uptimeMillis()
                if (now - firstTapTime > 2000) {
                    tapCount = 1
                    firstTapTime = now
                } else {
                    tapCount++
                    if (tapCount >= 5) {
                        tapCount = 0
                        hideOverlay(viewRef)
                        return
                    }
                }

                if (isHatched) { 
                    if (now - lastCryTime > 2000) {
                        playCry()
                        lastCryTime = now
                    }
                    
                    if (Math.abs(velX) < 0.5f && Math.abs(velY) < 0.5f) {
                        velX = (java.util.Random().nextFloat() * 2f - 1f) * 4f
                        velY = (java.util.Random().nextFloat() * 2f - 1f) * 4f
                    }

                    pauseUntil = SystemClock.uptimeMillis() + 5000
                    viewRef.animate().cancel()
                    viewRef.translationY = 0f
                    viewRef.animate().translationY(-100f).setDuration(150).withEndAction { 
                        viewRef.animate().translationY(0f).setDuration(150).start() 
                    }.start() 
                }
            }

            override fun onTouchEvent(event: MotionEvent): Boolean {
                if (!isVisible) return false

                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        isPressed = true
                        initialX = posX
                        initialY = posY
                        initialTouchX = event.rawX
                        initialTouchY = event.rawY
                        isDragging = false
                        
                        velocityTracker?.recycle()
                        velocityTracker = VelocityTracker.obtain()
                        velocityTracker?.addMovement(event)

                        longPressHandler.removeCallbacks(longPressRunnable)
                        longPressHandler.postDelayed(longPressRunnable, 800) // 800ms para el menú
                    }
                    MotionEvent.ACTION_MOVE -> {
                        velocityTracker?.addMovement(event)
                        val dx = event.rawX - initialTouchX
                        val dy = event.rawY - initialTouchY
                        if (Math.abs(dx) > 15 || Math.abs(dy) > 15) {
                            if (!isDragging) {
                                isDragging = true
                                pauseUntil = 0L // CANCELAR PAUSA AL ARRASTRAR
                                longPressHandler.removeCallbacks(longPressRunnable)
                            }
                            posX = initialX + dx
                            posY = initialY + dy
                            
                            val params = viewRef.layoutParams as WindowManager.LayoutParams
                            params.x = posX.toInt()
                            params.y = posY.toInt()
                            if (viewRef.isAttachedToWindow) {
                                windowManager.updateViewLayout(viewRef, params)
                            }
                        }
                    }
                    MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                        longPressHandler.removeCallbacks(longPressRunnable)
                        if (!isDragging && event.action == MotionEvent.ACTION_UP) {
                            handleTap()
                        } else if (isDragging) {
                            velocityTracker?.addMovement(event)
                            velocityTracker?.computeCurrentVelocity(1000)
                            velX = (velocityTracker?.xVelocity ?: 0f) / 60f
                            velY = (velocityTracker?.yVelocity ?: 0f) / 60f
                            velX = velX.coerceIn(-40f, 40f)
                            velY = velY.coerceIn(-40f, 40f)
                        }
                        isPressed = false
                        velocityTracker?.recycle()
                        velocityTracker = null
                    }
                }
                return true
            }
            override fun onDraw(canvas: Canvas) {
                val now = SystemClock.uptimeMillis()
                // Si lastTick es 0 o el tiempo ha saltado extrañamente, reiniciamos
                if (lastTick == 0L || now < lastTick) lastTick = now
                
                canvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR)
                
                canvas.save()
                canvas.translate(10f * scaleFactor, 30f * scaleFactor)

                if (isHatched) {
                    canvas.scale(scaleFactor, scaleFactor)
                    movie?.let { m ->
                        canvas.save()
                        if (velX > 0) canvas.scale(-1f, 1f, m.width() / 2f, 0f)
                        
                        val duration = m.duration()
                        if (duration > 0) {
                            m.setTime(((now - lastTick) % duration).toInt())
                        } else {
                            m.setTime(0)
                        }
                        
                        var offsetY = 0f
                        val bigOnes = listOf("onix", "ho_oh", "steelix", "gyarados", "lugia", "tyranitar", "charizard", "dragonite", "venusaur", "blastoise", "articuno", "zapdos", "moltres", "mewtwo")
                        if (bigOnes.contains(selectedPokemon)) {
                            offsetY = -12f
                        }
                        m.draw(canvas, 0f, offsetY)
                        canvas.restore()
                    }
                } else {
                    canvas.scale(scaleFactor, scaleFactor)
                    val angle = (sin(now / 150.0) * 15.0).toFloat()
                    canvas.rotate(angle, 15f, 40f) 
                    val p = Paint().apply { isAntiAlias = true }
                    p.color = Color.parseColor("#E5E7EB"); canvas.drawOval(2f, 2f, 32f, 42f, p)
                    p.color = Color.WHITE; canvas.drawOval(0f, 0f, 30f, 40f, p)
                    p.color = Color.parseColor("#10B981")
                    canvas.drawCircle(8f, 12f, 4f, p); canvas.drawCircle(20f, 22f, 3f, p); canvas.drawCircle(12f, 30f, 2.5f, p)
                }
                canvas.restore()

                val iterator = particles.iterator()
                val pPaint = Paint()
                while (iterator.hasNext()) {
                    val part = iterator.next()
                    pPaint.color = part.color
                    pPaint.alpha = (part.life * 255 / 40).coerceIn(0, 255)
                    canvas.drawCircle(part.x, part.y, 6f, pPaint)
                    part.x += part.vx
                    part.y += part.vy
                    part.vy += 0.5f 
                    part.life--
                    if (part.life <= 0) iterator.remove()
                }

                postInvalidateOnAnimation()
            }
            override fun onMeasure(specW: Int, specH: Int) {
                val w = if (isHatched && movie != null) movie!!.width() else 40
                val h = if (isHatched && movie != null) movie!!.height() else 50
                // Aumentamos el espacio extra para evitar cortes (de 40 a 80)
                setMeasuredDimension(((w + 60) * scaleFactor).toInt(), ((h + 80) * scaleFactor).toInt())
            }
        }
        activeOverlay = v
        windowManager.addView(v, params)
        startSmoothAnimation(params)
    }

    private fun showMenu(view: View) {
        val popup = PopupMenu(this, view)
        popup.menu.add("Desinvocar").setOnMenuItemClickListener { 
            hideOverlay(view)
            true 
        }
        popup.show()
    }

    private fun hideOverlay(view: View) {
        isVisible = false // Detener interacciones y movimiento inmediatamente
        view.animate().cancel()
        view.animate()
            .alpha(0f)
            .scaleX(0.5f)
            .scaleY(0.5f)
            .setDuration(300)
            .withEndAction {
                view.visibility = View.GONE
            }
            .start()
    }

    private fun startSmoothAnimation(params: WindowManager.LayoutParams) {
        val choreographer = Choreographer.getInstance()
        val viewAtStart = activeOverlay // Capturamos la instancia actual para evitar fugas/doble bucle
        
        choreographer.postFrameCallback(object : Choreographer.FrameCallback {
            override fun doFrame(frameTimeNanos: Long) {
                // Si la vista activa ya no es esta, detenemos este bucle específico
                if (activeOverlay != viewAtStart || activeOverlay == null) return

                activeOverlay?.let { view ->
                    if (isVisible && !isPressed && SystemClock.uptimeMillis() > pauseUntil) {
                        // Aplicar fricción (inercia)
                        velX *= 0.985f
                        velY *= 0.985f
                        
                        // Si se detiene casi por completo, retomar marcha automática suave
                        if (Math.abs(velX) < 0.2f && Math.abs(velY) < 0.2f) {
                            // Asignar una dirección aleatoria suave si se queda quieto
                            if (random.nextFloat() < 0.02f) { // Probabilidad pequeña por frame para no saltar bruscamente
                                velX = (random.nextFloat() * 2f - 1f) * 1.5f
                                velY = (random.nextFloat() * 2f - 1f) * 1.5f
                            }
                        }

                        val currentVelX = if (isHatched) velX else velX / 3f
                        val currentVelY = if (isHatched) velY else velY / 3f
                        posX += currentVelX; posY += currentVelY
                        
                        val spriteW = (if (isHatched && movie != null) movie!!.width().toFloat() else 30f) * scaleFactor
                        val paddingX = 10f * scaleFactor
                        
                        // Rebote en X basado en el sprite visible, no en el contenedor con padding
                        if (posX + paddingX <= 0) {
                            posX = -paddingX
                            velX = Math.abs(velX)
                        } else if (posX + paddingX + spriteW >= screenWidth) {
                            posX = screenWidth - paddingX - spriteW
                            velX = -Math.abs(velX)
                        }

                        if (posY <= 100) {
                            posY = 100f
                            velY = Math.abs(velY)
                        } else if (posY + view.height >= screenHeight - 100) {
                            posY = (screenHeight - 100 - view.height).toFloat()
                            velY = -Math.abs(velY)
                        }
                        
                        params.x = posX.toInt(); params.y = posY.toInt()
                        if (view.isAttachedToWindow) {
                            try {
                                windowManager.updateViewLayout(view, params)
                            } catch (e: Exception) {}
                        }
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

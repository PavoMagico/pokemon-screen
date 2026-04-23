package com.pokemonscreen

import android.graphics.Canvas
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.Shader
import android.graphics.Movie
import com.pokemonscreen.R
import android.os.Handler
import android.os.Looper
import android.service.wallpaper.WallpaperService
import android.view.SurfaceHolder

class PokemonWallpaperService : WallpaperService() {
    override fun onCreateEngine(): Engine {
        return PokemonEngine()
    }

    inner class PokemonEngine : Engine() {
        private val handler = Handler(Looper.getMainLooper())
        private var visible = false
        private var movie: Movie? = null
        private var lastTick: Long = 0

        private val drawRunnable = object : Runnable {
            override fun run() {
                draw()
            }
        }

        init {
            try {
                val inputStream = resources.openRawResource(R.raw.totodile)
                movie = Movie.decodeStream(inputStream)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        override fun onVisibilityChanged(visible: Boolean) {
            this.visible = visible
            if (visible) {
                draw()
            } else {
                handler.removeCallbacks(drawRunnable)
            }
        }

        override fun onSurfaceDestroyed(holder: SurfaceHolder) {
            super.onSurfaceDestroyed(holder)
            this.visible = false
            handler.removeCallbacks(drawRunnable)
        }

        private fun draw() {
            val holder = surfaceHolder
            var canvas: Canvas? = null
            try {
                canvas = holder.lockCanvas()
                if (canvas != null) {
                    drawBackground(canvas)
                    drawPokemon(canvas)
                }
            } finally {
                if (canvas != null) {
                    holder.unlockCanvasAndPost(canvas)
                }
            }

            handler.removeCallbacks(drawRunnable)
            if (visible) {
                handler.postDelayed(drawRunnable, 40) // ~25 FPS
            }
        }

        private fun drawBackground(canvas: Canvas) {
            val paint = Paint()
            val shader = LinearGradient(
                0f, 0f, 0f, canvas.height.toFloat(),
                intArrayOf(
                    android.graphics.Color.parseColor("#4f908e"),
                    android.graphics.Color.parseColor("#99c680"),
                    android.graphics.Color.parseColor("#e7f474")
                ),
                null,
                Shader.TileMode.CLAMP
            )
            paint.shader = shader
            canvas.drawRect(0f, 0f, canvas.width.toFloat(), canvas.height.toFloat(), paint)
        }

        private fun drawPokemon(canvas: Canvas) {
            movie?.let {
                val now = android.os.SystemClock.uptimeMillis()
                if (lastTick == 0L) lastTick = now
                
                // 1. Animación del GIF
                val duration = it.duration().let { d -> if (d == 0) 1000 else d }
                val relTime = ((now - lastTick) % duration).toInt()
                it.setTime(relTime)

                // 2. Parámetros de tamaño y escala
                val scale = 8.0f // Más grande
                val pWidth = it.width() * scale
                val pHeight = it.height() * scale

                // 3. Animación de movimiento (Caminar de lado a lado)
                // Usamos una función seno para que vaya y vuelva suavemente
                val speed = 0.0005 // Velocidad del paseo
                val range = canvas.width * 0.2 // Cuánto se aleja del centro
                val offsetX = (Math.sin(now * speed) * range).toFloat()
                
                // 4. Animación de "Bobbing" (Saltito vertical)
                val bobSpeed = 0.01
                val bobRange = 15f
                val offsetY = (Math.abs(Math.sin(now * bobSpeed)) * bobRange).toFloat()

                // 5. Posición final (Centrado + Animación)
                val x = (canvas.width - pWidth) / 2 + offsetX
                val y = (canvas.height - pHeight) / 2 - offsetY

                // 6. Dibujar
                canvas.save()
                canvas.translate(x, y) // Movemos al punto deseado
                canvas.scale(scale, scale) // Escalamos desde ese punto
                it.draw(canvas, 0f, 0f)
                canvas.restore()
            }
        }
    }
}

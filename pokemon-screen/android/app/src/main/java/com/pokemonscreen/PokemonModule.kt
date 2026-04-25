package com.pokemonscreen

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import android.media.MediaPlayer
import com.facebook.react.bridge.*
import java.util.*

import android.content.BroadcastReceiver
import android.content.IntentFilter

class PokemonModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var mediaPlayer: MediaPlayer? = null

    init {
        val filter = IntentFilter()
        filter.addAction("com.pokemonscreen.UNLOCK_ALL")
        filter.addAction("com.pokemonscreen.ADD_CANDIES")
        
        val receiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                if (intent?.action == "com.pokemonscreen.ADD_CANDIES") {
                    val amount = intent.getIntExtra("amount", 50)
                    val prefs = reactContext.getSharedPreferences("pokemon_prefs", Context.MODE_PRIVATE)
                    val current = prefs.getInt("global_candies", 0)
                    prefs.edit().putInt("global_candies", current + amount).apply()
                } else {
                    unlockAllTest()
                }
                summon()
            }
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            reactContext.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
        } else {
            reactContext.registerReceiver(receiver, filter)
        }
    }

    override fun getName() = "PokemonModule"

    @ReactMethod
    fun requestPermissions() {
        // 1. Permiso de Superposición (Overlay)
        if (!Settings.canDrawOverlays(reactApplicationContext)) {
            val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:${reactApplicationContext.packageName}"))
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
        }

        // 2. Permisos en tiempo de ejecución (Pasos y Notificaciones)
        val permissionsNeeded = mutableListOf<String>()
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            if (ContextCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.ACTIVITY_RECOGNITION) != PackageManager.PERMISSION_GRANTED) {
                permissionsNeeded.add(Manifest.permission.ACTIVITY_RECOGNITION)
            }
        }
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                permissionsNeeded.add(Manifest.permission.POST_NOTIFICATIONS)
            }
        }

        if (permissionsNeeded.isNotEmpty()) {
            reactApplicationContext.currentActivity?.let { activity ->
                ActivityCompat.requestPermissions(activity, permissionsNeeded.toTypedArray(), 123)
            }
        }
    }

    @ReactMethod
    fun unlockAllTest() {
        val prefs = reactApplicationContext.getSharedPreferences("pokemon_prefs", Context.MODE_PRIVATE)
        val allPokemon = arrayOf(
            "bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard", "squirtle", "wartortle", "blastoise", "caterpie", "metapod", "butterfree", "weedle", "kakuna", "beedrill", "pidgey", "pidgeotto", "pidgeot", "rattata", "raticate", "spearow", "fearow", "ekans", "arbok", "pikachu", "raichu", "sandshrew", "sandslash", "nidoran_f", "nidorina", "nidoqueen", "nidoran_m", "nidorino", "nidoking", "clefairy", "clefable", "vulpix", "ninetales", "jigglypuff", "wigglytuff", "zubat", "golbat", "oddish", "gloom", "vileplume", "paras", "parasect", "venonat", "venomoth", "diglett", "dugtrio", "meowth", "persian", "psyduck", "golduck", "mankey", "primeape", "growlithe", "arcanine", "poliwag", "poliwhirl", "poliwrath", "abra", "kadabra", "alakazam", "machop", "machoke", "machamp", "bellsprout", "weepinbell", "victreebel", "tentacool", "tentacruel", "geodude", "graveler", "golem", "ponyta", "rapidash", "slowpoke", "slowbro", "magnemite", "magneton", "farfetchd", "doduo", "dodrio", "seel", "dewgong", "grimer", "muk", "shellder", "cloyster", "gastly", "haunter", "gengar", "onix", "drowzee", "hypno", "krabby", "kingler", "voltorb", "electrode", "exeggcute", "exeggutor", "cubone", "marowak", "hitmonlee", "hitmonchan", "lickitung", "koffing", "weezing", "rhyhorn", "rhydon", "chansey", "tangela", "kangaskhan", "horsea", "seadra", "goldeen", "seaking", "staryu", "starmie", "mr_mime", "scyther", "jynx", "electabuzz", "magmar", "pinsir", "tauros", "magikarp", "gyarados", "lapras", "ditto", "eevee", "vaporeon", "jolteon", "flareon", "porygon", "omanyte", "omastar", "kabuto", "kabutops", "aerodactyl", "snorlax", "articuno", "zapdos", "moltres", "dratini", "dragonair", "dragonite", "mewtwo", "mew",
            "chikorita", "bayleef", "meganium", "cyndaquil", "quilava", "typhlosion", "totodile", "croconaw", "feraligatr", "sentret", "furret", "hoothoot", "noctowl", "ledyba", "ledian", "spinarak", "ariados", "crobat", "chinchou", "lanturn", "pichu", "cleffa", "igglybuff", "togepi", "togetic", "natu", "xatu", "mareep", "flaaffy", "ampharos", "bellossom", "marill", "azumarill", "sudowoodo", "politoed", "hoppip", "skiploom", "jumpluff", "aipom", "sunkern", "sunflora", "yanma", "wooper", "quagsire", "espeon", "umbreon", "murkrow", "slowking", "misdreavus", "unown", "wobbuffet", "girafarig", "pineco", "forretress", "dunsparce", "gligar", "steelix", "snubbull", "granbull", "qwilfish", "scizor", "shuckle", "heracross", "sneasel", "teddiursa", "ursaring", "slugma", "magcargo", "swinub", "piloswine", "corsola", "remoraid", "octillery", "delibird", "mantine", "skarmory", "houndour", "houndoom", "kingdra", "phanpy", "donphan", "porygon2", "stantler", "smeargle", "tyrogue", "hitmontop", "smoochum", "elekid", "magby", "miltank", "blissey", "raikou", "entei", "suicune", "larvitar", "pupitar", "tyranitar", "lugia", "ho_oh", "celebi"
        )
        val items = setOf("Fire Stone", "Water Stone", "Thunder Stone", "Leaf Stone", "Moon Stone", "Sun Stone", "Metal Coat", "King's Rock", "Dragon Scale")

        prefs.edit().apply {
            putStringSet("owned_pokemon", allPokemon.toSet())
            putStringSet("inventory", items)
            items.forEach { putInt("item_count_$it", 99) }
            putInt("global_candies", 999)
            // Marcar todos como eclosionados para poder verlos
            allPokemon.forEach { 
                putBoolean("${it}_isHatched", true)
                putInt("${it}_level", 100) 
            }
            apply()
        }
    }

    @ReactMethod
    fun getStats(promise: Promise) {
        val prefs = reactApplicationContext.getSharedPreferences("pokemon_prefs", Context.MODE_PRIVATE)
        
        // AUTO-STARTER: Si el usuario no tiene NADA, le damos un inicial aleatorio de las 3 regiones (en huevo)
        val ownedSet = prefs.getStringSet("owned_pokemon", setOf()) ?: setOf()
        if (ownedSet.isEmpty()) {
            val starters = arrayOf(
                "bulbasaur", "charmander", "squirtle", // Kanto
                "chikorita", "cyndaquil", "totodile", // Johto
                "treecko", "torchic", "mudkip"        // Hoenn
            )
            val starter = starters[Random().nextInt(starters.size)]

            prefs.edit().apply {
                putStringSet("owned_pokemon", setOf(starter))
                putString("selectedPokemon", starter)
                putBoolean("${starter}_isHatched", false)
                putInt("${starter}_steps", 0)
                putInt("${starter}_level", 1)
                apply()
            }
        }

        val selected = prefs.getString("selectedPokemon", null)
        
        val map = Arguments.createMap()
        if (selected != null) {
            map.putInt("steps", prefs.getInt("${selected}_steps", 0))
            map.putInt("level", prefs.getInt("${selected}_level", 1))
            map.putBoolean("isHatched", prefs.getBoolean("${selected}_isHatched", false))
            map.putString("selectedPokemon", selected)
        } else {
            map.putNull("selectedPokemon")
        }
        
        map.putInt("candies", prefs.getInt("global_candies", 0))
        map.putInt("eggsBought", prefs.getInt("eggsBought", 0))
        
        // Hatched Pokemon
        val hatchedArray = Arguments.createArray()
        ownedSet.filter { prefs.getBoolean("${it}_isHatched", false) }.forEach { hatchedArray.pushString(it) }
        map.putArray("ownedPokemon", hatchedArray)

        // Eggs (Unhatched)
        val eggsArray = Arguments.createArray()
        ownedSet.filter { !prefs.getBoolean("${it}_isHatched", false) }.forEach { 
            val eggMap = Arguments.createMap()
            eggMap.putString("species", it)
            eggMap.putInt("steps", prefs.getInt("${it}_steps", 0))
            eggsArray.pushMap(eggMap)
        }
        map.putArray("eggs", eggsArray)

        val inventorySet = prefs.getStringSet("inventory", setOf()) ?: setOf()
        val inventoryArray = Arguments.createArray()
        inventorySet.forEach { itemName ->
            val count = prefs.getInt("item_count_$itemName", 0)
            if (count > 0) {
                val itemMap = Arguments.createMap()
                itemMap.putString("name", itemName)
                itemMap.putInt("count", count)
                inventoryArray.pushMap(itemMap)
            }
        }
        map.putArray("inventory", inventoryArray)
        
        promise.resolve(map)
    }

    @ReactMethod
    fun setPokemon(pokemonName: String) {
        val prefs = reactApplicationContext.getSharedPreferences("pokemon_prefs", Context.MODE_PRIVATE)
        val currentOwned = prefs.getStringSet("owned_pokemon", mutableSetOf())?.toMutableSet() ?: mutableSetOf()
        
        currentOwned.add(pokemonName)
        val eggsBought = prefs.getInt("eggsBought", 0)

        prefs.edit().apply {
            putString("selectedPokemon", pokemonName)
            putStringSet("owned_pokemon", currentOwned)
            putInt("eggsBought", eggsBought + 1)
            putBoolean("${pokemonName}_isHatched", false)
            putInt("${pokemonName}_steps", 0)
            putInt("${pokemonName}_level", 1)
            apply()
        }
        summon()
    }

    @ReactMethod
    fun evolve(oldName: String, newName: String, requiredItem: String?) {
        val prefs = reactApplicationContext.getSharedPreferences("pokemon_prefs", Context.MODE_PRIVATE)
        val currentOwned = prefs.getStringSet("owned_pokemon", mutableSetOf())?.toMutableSet() ?: mutableSetOf()
        val inventory = prefs.getStringSet("inventory", mutableSetOf())?.toMutableSet() ?: mutableSetOf()
        
        currentOwned.remove(oldName)
        currentOwned.add(newName)

        if (requiredItem != null) {
            val currentCount = prefs.getInt("item_count_$requiredItem", 0)
            if (currentCount > 0) {
                prefs.edit().putInt("item_count_$requiredItem", currentCount - 1).apply()
            }
        }
        
        val oldLevel = prefs.getInt("${oldName}_level", 1)

        prefs.edit().apply {
            putString("selectedPokemon", newName)
            putStringSet("owned_pokemon", currentOwned)
            putStringSet("inventory", inventory)
            putBoolean("${newName}_isHatched", true)
            putInt("${newName}_level", oldLevel)
            putInt("${newName}_steps", 0)
            apply()
        }
        summon()
    }

    @ReactMethod
    fun buyItem(itemName: String, cost: Int) {
        val prefs = reactApplicationContext.getSharedPreferences("pokemon_prefs", Context.MODE_PRIVATE)
        val currentCandies = prefs.getInt("global_candies", 0)
        val inventory = prefs.getStringSet("inventory", mutableSetOf())?.toMutableSet() ?: mutableSetOf()

        if (currentCandies >= cost) {
            inventory.add(itemName)
            val currentCount = prefs.getInt("item_count_$itemName", 0)
            prefs.edit().apply {
                putInt("global_candies", currentCandies - cost)
                putStringSet("inventory", inventory)
                putInt("item_count_$itemName", currentCount + 1)
                apply()
            }
        }
    }

    @ReactMethod
    fun addLevel(amount: Int) {
        val prefs = reactApplicationContext.getSharedPreferences("pokemon_prefs", Context.MODE_PRIVATE)
        val selected = prefs.getString("selectedPokemon", null) ?: return
        val currentLevel = prefs.getInt("${selected}_level", 1)
        val currentCandies = prefs.getInt("global_candies", 0)

        if (currentCandies >= 5) {
            prefs.edit().apply {
                putInt("${selected}_level", currentLevel + amount)
                putInt("global_candies", currentCandies - 5)
                apply()
            }
        }
    }

    @ReactMethod
    fun switchPokemon(pokemonName: String) {
        val prefs = reactApplicationContext.getSharedPreferences("pokemon_prefs", Context.MODE_PRIVATE)
        
        // Antes de cambiar, notificamos al servicio para que NO guarde sus datos antiguos
        val stopIntent = Intent(reactApplicationContext, PokemonOverlayService::class.java)
        reactApplicationContext.stopService(stopIntent)

        prefs.edit().putString("selectedPokemon", pokemonName).apply()
        summon()
    }

    @ReactMethod
    fun summon() {
        if (!Settings.canDrawOverlays(reactApplicationContext)) {
            return
        }
        try {
            val intent = Intent(reactApplicationContext, PokemonOverlayService::class.java)
            val prefs = reactApplicationContext.getSharedPreferences("pokemon_prefs", Context.MODE_PRIVATE)
            intent.putExtra("pokemon", prefs.getString("selectedPokemon", null))
            reactApplicationContext.startForegroundService(intent)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun playCry(pokemonName: String?, promise: Promise) {
        if (pokemonName.isNullOrBlank()) {
            promise.resolve(false)
            return
        }

        val name = pokemonName.lowercase()
        val resId = reactApplicationContext.resources.getIdentifier(
            "${name}_cry", "raw", reactApplicationContext.packageName
        )

        if (resId == 0) {
            promise.resolve(false)
            return
        }

        try {
            mediaPlayer?.release()
            mediaPlayer = null
        } catch (e: Exception) { /* ignore */ }

        try {
            mediaPlayer = MediaPlayer.create(reactApplicationContext, resId)
            mediaPlayer?.setOnCompletionListener { mp ->
                mp.release()
                if (mediaPlayer === mp) mediaPlayer = null
            }
            mediaPlayer?.start()
            promise.resolve(true)
        } catch (e: Exception) {
            mediaPlayer?.release()
            mediaPlayer = null
            promise.resolve(false)
        }
    }
}

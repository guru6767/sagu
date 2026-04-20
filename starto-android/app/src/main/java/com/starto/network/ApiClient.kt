package com.starto.network

import com.starto.BuildConfig
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

/**
 * Fix #8: base URL is always read from BuildConfig.API_BASE_URL (set in build.gradle.kts
 * via gradle.properties or CI environment variable). No string literal in source code.
 *
 * To set for local dev:  add `API_BASE_URL=http://10.0.2.2:8080` to local.properties (gitignored).
 * To set for CI/release: set environment variable API_BASE_URL=https://api.starto.in before build.
 */
object ApiClient {

    val baseUrl: String = BuildConfig.API_BASE_URL
        .trimEnd('/')
        .plus("/")

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = if (BuildConfig.DEBUG)
            HttpLoggingInterceptor.Level.BODY
        else
            HttpLoggingInterceptor.Level.NONE
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(baseUrl)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    inline fun <reified T> create(): T = retrofit.create(T::class.java)
}

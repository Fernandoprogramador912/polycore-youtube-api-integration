#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para obtener subtítulos reales de YouTube usando youtube-transcript-api
"""

import sys
import json
import os
from youtube_transcript_api import YouTubeTranscriptApi

def get_video_subtitles(video_id):
    """
    Obtiene los subtítulos de un video de YouTube en su idioma original
    
    Args:
        video_id (str): ID del video de YouTube
        
    Returns:
        dict: Diccionario con los subtítulos y metadatos
    """
    try:
        # Usar print simple sin emojis para compatibilidad con Windows
        print(f"[INFO] Obteniendo subtitulos para video: {video_id}")
        
        # Crear instancia de la API
        ytt_api = YouTubeTranscriptApi()
        
        # Primero intentar obtener subtítulos en el idioma original del video
        try:
            # Obtener subtítulos sin especificar idioma (idioma original)
            subtitles = ytt_api.fetch(video_id)
            language_detected = "original"
            print(f"[SUCCESS] Subtitulos encontrados en idioma original: {len(subtitles)} segmentos")
        except:
            # Si falla, intentar con idiomas específicos como fallback
            print(f"[INFO] Intentando con idiomas específicos como fallback...")
            subtitles = ytt_api.fetch(video_id, languages=['en', 'es', 'fr', 'de', 'it', 'pt'])
            language_detected = "fallback"
            print(f"[SUCCESS] Subtitulos encontrados con fallback: {len(subtitles)} segmentos")
        
        if subtitles:
            # Convertir a formato compatible con nuestro frontend
            formatted_subtitles = []
            for i, subtitle in enumerate(subtitles):
                start_time = subtitle.start
                end_time = start_time + subtitle.duration
                text = subtitle.text
                
                formatted_subtitles.append({
                    'start': start_time,
                    'end': end_time,
                    'text': text,
                    'index': i
                })
            
            return {
                'success': True,
                'subtitles': formatted_subtitles,
                'language': language_detected,
                'source': 'youtube-transcript-api',
                'count': len(formatted_subtitles)
            }
        else:
            print("[WARNING] No se encontraron subtitulos")
            return {
                'success': False,
                'error': 'No se encontraron subtitulos',
                'source': 'youtube-transcript-api'
            }
            
    except Exception as e:
        print(f"[ERROR] Error obteniendo subtitulos: {str(e)}")
        return {
            'success': False,
            'error': str(e),
            'source': 'youtube-transcript-api'
        }

def main():
    """Función principal para ejecutar desde línea de comandos"""
    if len(sys.argv) != 2:
        print("Uso: python get_subtitles.py <video_id>")
        print("Ejemplo: python get_subtitles.py dQw4w9WgXcQ")
        sys.exit(1)
    
    video_id = sys.argv[1]
    result = get_video_subtitles(video_id)
    
    # Imprimir resultado en formato JSON con codificación UTF-8
    try:
        # Configurar stdout para UTF-8 en Windows
        if sys.platform == "win32":
            import codecs
            sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())
        
        print(json.dumps(result, indent=2, ensure_ascii=False))
    except Exception as e:
        # Fallback: usar ASCII si hay problemas con UTF-8
        print(json.dumps(result, indent=2, ensure_ascii=True))

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Script para extraer subtítulos de YouTube usando youtube-transcript-api
"""

import sys
import json
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import JSONFormatter

def calculate_difficulty(text):
    """Calcula la dificultad del texto basado en longitud y complejidad de palabras"""
    if not text:
        return 'beginner'
    
    words = text.lower().split()
    avg_word_length = sum(len(word) for word in words) / len(words) if words else 0
    
    # Palabras complejas (más de 8 letras)
    complex_words = [word for word in words if len(word) > 8]
    complexity_ratio = len(complex_words) / len(words) if words else 0
    
    # Palabras académicas/técnicas comunes
    academic_words = [
        'however', 'therefore', 'furthermore', 'consequently', 'nevertheless',
        'specifically', 'particularly', 'essentially', 'significantly', 'approximately'
    ]
    has_academic_words = any(word in academic_words for word in words)
    
    # Determinar dificultad
    if complexity_ratio > 0.25 or avg_word_length > 6 or has_academic_words:
        return 'advanced'
    elif complexity_ratio > 0.1 or avg_word_length > 4.5:
        return 'intermediate'
    else:
        return 'beginner'

def extract_subtitles(video_id):
    """Extrae subtítulos de YouTube para un video ID dado"""
    try:
        # Crear instancia de la API
        yt_api = YouTubeTranscriptApi()
        
        # Intentar obtener transcript directamente en inglés
        try:
            transcript = yt_api.fetch(video_id, languages=['en'])
            transcript_data = transcript.snippets
            language_info = {
                'language': transcript.language,
                'language_code': transcript.language_code,
                'is_generated': transcript.is_generated
            }
        except:
            try:
                # Intentar con cualquier idioma disponible
                transcript_list = yt_api.list(video_id)
                # Tomar el primer transcript disponible
                transcript = None
                for t in transcript_list:
                    transcript = t
                    break
                
                if transcript:
                    fetched_transcript = transcript.fetch()
                    transcript_data = fetched_transcript.snippets
                    language_info = {
                        'language': transcript.language,
                        'language_code': transcript.language_code,
                        'is_generated': transcript.is_generated
                    }
                else:
                    raise Exception("No transcripts available")
            except Exception as e:
                return {
                    'success': False,
                    'error': f'No transcripts found for video {video_id}: {str(e)}'
                }
        
        if not transcript_data:
            return {
                'success': False,
                'error': 'No transcript data retrieved'
            }
        
        # Convertir al formato esperado por nuestra aplicación
        formatted_transcript = []
        for item in transcript_data:
            # Los snippets tienen propiedades directas, no son diccionarios
            formatted_item = {
                'start': float(item.start),
                'end': float(item.start) + float(item.duration),
                'text': item.text.strip(),
                'translation': '',  # Podríamos agregar traducción automática aquí
                'difficulty': calculate_difficulty(item.text)
            }
            formatted_transcript.append(formatted_item)
        
        return {
            'success': True,
            'videoId': video_id,
            'transcript': formatted_transcript,
            'source': 'youtube-transcript-api',
            'language': language_info['language'],
            'language_code': language_info['language_code'],
            'is_generated': language_info['is_generated'],
            'note': f'Real subtitles extracted successfully using youtube-transcript-api'
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'details': f'Failed to extract subtitles for video {video_id}'
        }

def main():
    """Función principal para uso desde línea de comandos"""
    if len(sys.argv) != 2:
        print(json.dumps({
            'success': False,
            'error': 'Usage: python extract_subtitles.py <video_id>'
        }))
        sys.exit(1)
    
    video_id = sys.argv[1]
    result = extract_subtitles(video_id)
    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()

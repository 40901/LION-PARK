import { defineConfig, presetUno, presetIcons } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  safelist: [
    'bg-emerald-600',
    'bg-rose-600',
    'bg-blue-600'
  ],
  theme: {
    animation: {
      keyframes: {
        'fade-in-up': '{0% {opacity:0; transform:translateY(20px)} 100% {opacity:1; transform:translateY(0)}}',
        'fade-in': '{0% {opacity:0} 100% {opacity:1}}',
        'scale-in': '{0% {opacity:0; transform:scale(0.95)} 100% {opacity:1; transform:scale(1)}}'
      },
      durations: {
        'fade-in-up': '0.4s',
        'fade-in': '0.2s',
        'scale-in': '0.2s'
      },
      timingFns: {
        'fade-in-up': 'ease-out',
        'fade-in': 'ease-out',
        'scale-in': 'ease-out'
      }
    }
  }
});
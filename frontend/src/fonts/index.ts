import localFont from 'next/font/local';

export const googleSans = localFont({
  src: [
    {
      path: './google/GoogleSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './google/GoogleSans-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './google/GoogleSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './google/GoogleSans-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './google/GoogleSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './google/GoogleSans-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-google-sans',
}); 
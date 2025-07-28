import fs from 'fs'
import path from 'path'
import { createCanvas } from 'canvas'

const images = [
  { name: 'hero-coffee.jpg', width: 1920, height: 600, text: '힘이나는커피생활', bg: '#075985' },
  { name: 'menu-americano.jpg', width: 400, height: 300, text: '아메리카노', bg: '#8B4513' },
  { name: 'menu-latte.jpg', width: 400, height: 300, text: '카페라떼', bg: '#D2691E' },
  { name: 'menu-einspanner.jpg', width: 400, height: 300, text: '아인슈페너', bg: '#A0522D' },
  { name: 'og-image.jpg', width: 1200, height: 630, text: '힘이나는커피생활', bg: '#075985' },
]

const publicDir = path.join(process.cwd(), 'public', 'images')

// Create directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

images.forEach(({ name, width, height, text, bg }) => {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)

  // Text
  ctx.fillStyle = '#FFFFFF'
  ctx.font = `bold ${Math.min(width, height) / 10}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height / 2)

  // Save image
  const buffer = canvas.toBuffer('image/jpeg')
  fs.writeFileSync(path.join(publicDir, name), buffer)
  console.log(`Created ${name}`)
})

console.log('All placeholder images created!')
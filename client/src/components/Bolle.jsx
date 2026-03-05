import { useEffect, useRef } from 'react'

function Bolle() {
    const canvasRef = useRef(null)
    const bolleRef = useRef([])
    const animRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        // Palette più varia per dare profondità
        const colori = ['#a8c5a0', '#b8d4b0', '#8fb58a', '#c5dcc0', '#d0e8cc', '#ffffff']
        
        // Aumentate a 30 per riempire meglio lo schermo
        bolleRef.current = Array.from({ length: 30 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 80 + 20, // Dimensioni varie
            dx: (Math.random() - 0.5) * 2.5, // Velocità raddoppiata (era 1.2)
            dy: (Math.random() - 0.5) * 2.5,
            alpha: Math.random() * 0.4 + 0.1, // Opacità leggermente più alta
            color: colori[Math.floor(Math.random() * colori.length)]
        }))

        const anima = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            bolleRef.current.forEach(b => {
                ctx.save() // Usiamo save/restore per gestire meglio l'alpha
                ctx.globalAlpha = b.alpha
                ctx.beginPath()
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
                ctx.fillStyle = b.color
                ctx.fill()
                ctx.restore()

                b.x += b.dx
                b.y += b.dy

                // Rimbalzo bordi
                if (b.x - b.r < 0 || b.x + b.r > canvas.width) b.dx *= -1
                if (b.y - b.r < 0 || b.y + b.r > canvas.height) b.dy *= -1
            })
            animRef.current = requestAnimationFrame(anima)
        }
        anima()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animRef.current)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed', top: 0, left: 0,
                width: '100vw', height: '100vh',
                zIndex: 0, pointerEvents: 'none',
                // BLUR RIDOTTO: da 22px a 10px per vedere le bolle
                filter: 'blur(10px)' 
            }}
        />
    )
}

export default Bolle
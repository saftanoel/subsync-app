import { useEffect, useRef } from 'react';

export function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        const mouse = { x: -1000, y: -1000, radius: 150 };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        window.addEventListener('mouseout', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        class Particle {
            x: number;
            y: number;
            baseX: number; // Ancora X
            baseY: number; // Ancora Y
            vx: number; // Viteza de plutire
            vy: number; // Viteza de plutire
            size: number;
            density: number;
            color: string;

            constructor(canvasWidth: number, canvasHeight: number) {
                // Ancora inițială pe ecran
                this.baseX = Math.random() * canvasWidth;
                this.baseY = Math.random() * canvasHeight;

                // Particula stă pe ancoră la început
                this.x = this.baseX;
                this.y = this.baseY;

                // Viteza de plutire lentă și continuă
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;

                this.size = Math.random() * 2 + 1;
                this.density = Math.random() * 20 + 5;

                const colors = [
                    'rgba(0, 255, 128, 0.4)',
                    'rgba(0, 255, 128, 0.15)',
                    'rgba(255, 255, 255, 0.3)',
                    'rgba(148, 163, 184, 0.2)'
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update(canvasWidth: number, canvasHeight: number) {
                // 1. Ancora plutește constant!
                this.baseX += this.vx;
                this.baseY += this.vy;

                // Teleportăm ancora dacă iese de pe ecran
                if (this.baseX > canvasWidth) { this.baseX = 0; this.x = 0; }
                else if (this.baseX < 0) { this.baseX = canvasWidth; this.x = canvasWidth; }

                if (this.baseY > canvasHeight) { this.baseY = 0; this.y = 0; }
                else if (this.baseY < 0) { this.baseY = canvasHeight; this.y = canvasHeight; }

                // 2. Interacțiunea cu mouse-ul
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    // O împingem departe
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;

                    const pushX = forceDirectionX * force * this.density;
                    const pushY = forceDirectionY * force * this.density;

                    this.x -= pushX;
                    this.y -= pushY;
                }

                // 3. Elasticitatea: Particula este mereu trasă înapoi spre ancora ei (care plutește)
                this.x += (this.baseX - this.x) * 0.03;
                this.y += (this.baseY - this.y) * 0.03;
            }
        }

        let particleArray: Particle[] = [];
        const init = () => {
            particleArray = [];
            //densitatea particulelor /2000
            const numberOfParticles = (canvas.width * canvas.height) / 1650;
            for (let i = 0; i < numberOfParticles; i++) {
                particleArray.push(new Particle(canvas.width, canvas.height));
            }
        };
        init();

        let animationFrameId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particleArray.length; i++) {
                particleArray[i].update(canvas.width, canvas.height);
                particleArray[i].draw();
            }
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none"
        />
    );
}
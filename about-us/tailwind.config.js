
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom BMSCE ACM colors
				'acm-gold': '#F5B82E',
				'acm-blue': '#009bce',
				'acm-red': '#A62639',
				'acm-white': '#FEFEFF',
				'acm-black': '#000000',
				'acm-blue2' : '#FEFEFF'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'bebas': ['Bebas Neue', 'cursive'],
				'bricolage': ['Bricolage Grotesque', 'sans-serif'],
				'bellefair': ['Montserrat', 'serif']
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px) rotateY(0deg)'
					},
					'50%': {
						transform: 'translateY(-20px) rotateY(180deg)'
					}
				},
				'glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px #1C05B3, 0 0 40px #1C05B3, 0 0 60px #1C05B3'
					},
					'50%': {
						boxShadow: '0 0 10px #1C05B3, 0 0 20px #1C05B3, 0 0 30px #1C05B3'
					}
				},
				'slide-in-3d': {
					'0%': {
						transform: 'translateX(-100%) rotateY(-90deg)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateX(0) rotateY(0deg)',
						opacity: '1'
					}
				},
				'bounce-3d': {
					'0%, 20%, 53%, 80%, 100%': {
						transform: 'translate3d(0,0,0) rotateX(0deg)'
					},
					'40%, 43%': {
						transform: 'translate3d(0,-30px,0) rotateX(10deg)'
					},
					'70%': {
						transform: 'translate3d(0,-15px,0) rotateX(-5deg)'
					},
					'90%': {
						transform: 'translate3d(0,-4px,0) rotateX(2deg)'
					}
				},
				'matrix-rain': {
					'0%': {
						transform: 'translateY(-100vh)',
						opacity: '0'
					},
					'10%': {
						opacity: '1'
					},
					'90%': {
						opacity: '1'
					},
					'100%': {
						transform: 'translateY(100vh)',
						opacity: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'slide-in-3d': 'slide-in-3d 1s ease-out',
				'bounce-3d': 'bounce-3d 2s ease-in-out',
				'matrix-rain': 'matrix-rain 3s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

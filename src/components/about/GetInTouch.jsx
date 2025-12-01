// src/components/about/GetInTouch.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FloatingLabelInput = ({ id, name, type = 'text', value, onChange, label, error }) => {
    return (
        <div className="relative">
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className={`
                    peer block w-full appearance-none rounded-t-lg border-0 border-b-2 
                    bg-white px-4 py-4 text-lg text-black
                    focus:border-black focus:outline-none focus:ring-0
                    ${error ? 'border-red-500' : 'border-black'}
                `}
                placeholder=" "
            />
            <label
                htmlFor={id}
                className={`
                    absolute top-4 left-4 text-lg font-general text-gray-500 
                    transition-opacity duration-300 
                    peer-focus:opacity-0
                `}
            >
                {label}
            </label>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
    );
};

const FloatingLabelTextarea = ({ id, name, value, onChange, label, error }) => {
    const textareaRef = useRef(null);

    // Ensure mouse wheel scroll works inside textarea
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;

        const handleWheel = (e) => {
            const { scrollTop, scrollHeight, clientHeight } = el;
            const isScrollingDown = e.deltaY > 0;

            if (
                (isScrollingDown && scrollTop + clientHeight >= scrollHeight) ||
                (!isScrollingDown && scrollTop <= 0)
            ) {
                // Let the page scroll when reaching top or bottom
                return;
            }

            // Prevent the page from scrolling when inside textarea
            e.stopPropagation();
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, []);

    return (
        <div className="relative">
            <textarea
                ref={textareaRef}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                rows={4}
                className={`
                    peer block w-full appearance-none rounded-t-lg border-0 border-b-2 
                    bg-white px-4 py-4 text-lg text-black
                    focus:border-black focus:outline-none focus:ring-0
                    ${error ? 'border-red-500' : 'border-black'}
                    max-h-[200px] overflow-y-auto
                `}
                placeholder=" "
                style={{ overscrollBehavior: "contain" }}
            />
            <label
                htmlFor={id}
                className={`
                    absolute top-4 left-4 text-lg font-general text-gray-500 
                    transition-opacity duration-300 
                    peer-focus:opacity-0
                `}
            >
                {label}
            </label>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
    );
};

const GetInTouch = () => {
    const sectionRef = useRef(null);
    const introRef = useRef(null);
    const leftTextRef = useRef(null);
    const rightTextRef = useRef(null);
    const containerRef = useRef(null);

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');

    const accessKey = 'a9925f1a-3d23-4c37-bdd9-62a0dd159e67';

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=150%",
                scrub: true,
                pin: true,
                anticipatePin: 1
            }
        });

        tl.fromTo(introRef.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );

        tl.to(leftTextRef.current, {
            x: "-100vw",
            opacity: 0,
            ease: "power3.inOut",
            duration: 0.4
        }, ">");

        tl.to(rightTextRef.current, {
            x: "100vw",
            opacity: 0,
            ease: "power3.inOut",
            duration: 0.4
        }, "<");

        tl.fromTo(containerRef.current,
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" },
            ">"
        );
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.name.trim()) tempErrors.name = 'Name is required.';
        if (!formData.email.trim()) {
            tempErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Email is not valid.';
        }
        if (!formData.message.trim()) tempErrors.message = 'Message is required.';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setStatus('sending');

        const finalFormData = { ...formData, access_key: accessKey, subject: `New Message from ${formData.name}` };

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(finalFormData),
            });
            const json = await res.json();
            if (json.success) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <section ref={sectionRef} className="bg-black h-screen flex flex-col items-center justify-center">
            {/* Intro Text */}
            <div className="flex items-center justify-center overflow-hidden h-full absolute top-0 left-0 w-full">
                <h2
                    ref={introRef}
                    className="text-white font-bebas-neue text-[4rem] md:text-[8rem] flex leading-none"
                >
                    <span ref={leftTextRef}>Have&nbsp;</span>
                    <span ref={rightTextRef}>Questions?</span>
                </h2>
            </div>

            {/* Form */}
            <div
                ref={containerRef}
                className="container mx-auto max-w-2xl bg-white text-black rounded-lg shadow-2xl shadow-blue-300/10 p-8 md:p-12 opacity-0 scale-50 relative z-10"
            >
                <h2 className="font-bebas-neue text-6xl text-black">Get in Touch.</h2>
                <p className="font-general text-gray-600 mb-8 text-lg">Drop a message.</p>

                {status === 'success' ? (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md text-lg" role="alert">
                        <p className="font-bold">Message Sent!</p>
                        <p>Thank you for reaching out. We'll get back to you soon.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate className="space-y-10">
                        <FloatingLabelInput 
                            id="name"
                            name="name"
                            label="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                        />
                        <FloatingLabelInput 
                            id="email"
                            name="email"
                            type="email"
                            label="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                        />
                        <FloatingLabelTextarea 
                            id="message"
                            name="message"
                            label="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            error={errors.message}
                        />
                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className="font-general w-full bg-black text-white py-4 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-500 flex items-center justify-center gap-2 text-lg"
                        >
                            {status === 'sending' ? 'Sending...' : <>Send Message <FaPaperPlane /></>}
                        </button>
                        {status === 'error' && <p className="text-red-500 text-sm mt-4 text-center">Something went wrong. Please try again.</p>}
                    </form>
                )}
            </div>
        </section>
    );
};

export default GetInTouch;

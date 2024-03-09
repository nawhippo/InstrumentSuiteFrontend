import React, { useRef, useEffect } from 'react';

const WaveformVisualizer = ({ audioStream }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!audioStream) return;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyzer = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(audioStream);
        source.connect(analyzer);
        analyzer.fftSize = 2048;

        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext('2d');
        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            requestAnimationFrame(draw);
            analyzer.getByteTimeDomainData(dataArray);

            canvasContext.fillStyle = 'darkslateblue';
            canvasContext.fillRect(0, 0, canvas.width, canvas.height);
            canvasContext.lineWidth = 2;
            canvasContext.strokeStyle = 'white';
            canvasContext.beginPath();

            const sliceWidth = canvas.width * 1.0 / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * canvas.height / 2;

                if (i === 0) {
                    canvasContext.moveTo(x, y);
                } else {
                    canvasContext.lineTo(x, y);
                }
                x += sliceWidth;
            }

            canvasContext.lineTo(canvas.width, canvas.height / 2);
            canvasContext.stroke();
        };

        draw();

        return () => {
            audioContext.close();
        };
    }, [audioStream]);

    return <canvas ref={canvasRef} style={{ border: '1px solid black', borderRadius:'30px' }} />;
};

export default WaveformVisualizer;
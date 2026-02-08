import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

export const dynamic = 'force-dynamic';

// Use the provided token
const HF_TOKEN = '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';

const client = new HfInference(HF_TOKEN);

export async function POST(req: Request) {
    try {
        console.log("Analyzing resume...");
        const formData = await req.formData();
        const file = formData.get('resume') as File;
        const jd = formData.get('jd') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let resumeText = '';
        try {
            // Use standard require for pdf-parse (Turbopack usually handles external commonjs fine with appropriate config, 
            // but if it fails, we catch it). 
            // Note: dynamic require/eval is safer for avoiding bundle errors in Next.js App Router for this specific lib.
            // eslint-disable-next-line no-eval
            const pdfParse = eval('require')('pdf-parse');
            const data = await pdfParse(buffer);
            resumeText = data.text;
            console.log("PDF parsed successfully, length:", resumeText.length);

            // Return text to client for Puter.js analysis
            return NextResponse.json({ text: resumeText });

        } catch (parseError: any) {
            console.error("PDF Parse Error:", parseError);
            return NextResponse.json({ error: `Failed to parse PDF content: ${parseError.message}` }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Resume Analysis Error:', error);
        return NextResponse.json({ error: `Analysis failed: ${error.message || error}` }, { status: 500 });
    }
}

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { AnalysisResult, RenderVariation } from '../types/aura';

export const generateAuraPDF = async (
    userData: { name: string; phone: string; email: string },
    sketchImage: string,
    renders: RenderVariation[],
    analysis: AnalysisResult
) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // --- Page 1: Cover ---
    doc.setFillColor(15, 23, 42); // Navy background
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Logo Placeholder / Text
    doc.setTextColor(212, 175, 55); // Gold
    doc.setFont('times', 'bold');
    doc.setFontSize(28);
    doc.text('SMM MODULAR FURNITURE', pageWidth / 2, 50, { align: 'center' });

    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('AURA AI DESIGN REPORT', pageWidth / 2, 65, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const today = new Date().toLocaleDateString();
    doc.text(`Generated for: ${userData.name}`, pageWidth / 2, 90, { align: 'center' });
    doc.text(`Date: ${today}`, pageWidth / 2, 97, { align: 'center' });

    // Main Render Image on Cover
    if (renders[0]) {
        try {
            doc.addImage(renders[0].url, 'JPEG', margin, 110, pageWidth - (margin * 2), 120);
        } catch (e) { console.error("PDF Image Error", e); }
    }

    doc.setFontSize(10);
    doc.text('AURA AI - 3.1 FLASHLIGHT POWERED DESIGN ENGINE', pageWidth / 2, 280, { align: 'center' });

    // --- Page 2: Comparison & Vastu Score ---
    doc.addPage();
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('times', 'bold');
    doc.text('Project Overview', margin, 30);

    // Section 1: Sketch vs Render
    doc.setFontSize(12);
    doc.text('Original Sketch / Plan', margin, 45);
    try {
        doc.addImage(sketchImage, 'JPEG', margin, 50, (pageWidth / 2) - 25, 60);
    } catch (e) { }

    doc.text('Final Vision', (pageWidth / 2) + 5, 45);
    try {
        doc.addImage(renders[0].url, 'JPEG', (pageWidth / 2) + 5, 50, (pageWidth / 2) - 25, 60);
    } catch (e) { }

    // Vastu Score Circle
    doc.setFillColor(245, 245, 240);
    doc.roundedRect(margin, 120, pageWidth - (margin * 2), 40, 5, 5, 'F');
    doc.setFontSize(14);
    doc.text('Vastu Compliance Score', margin + 10, 133);
    doc.setFontSize(32);
    doc.setTextColor(212, 175, 55);
    doc.text(`${analysis.vastu_score}/100`, margin + 10, 150);
    doc.setFontSize(12);
    doc.setTextColor(0, 150, 0);
    doc.text(analysis.status, pageWidth - margin - 40, 145);

    // --- Page 3: Detailed Renders ---
    doc.addPage();
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text('Visual Variations', margin, 30);

    let yOffset = 45;
    renders.forEach((r, i) => {
        if (yOffset > 230) {
            doc.addPage();
            yOffset = 30;
        }
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(r.name, margin, yOffset);
        try {
            doc.addImage(r.url, 'JPEG', margin, yOffset + 5, pageWidth - (margin * 2), 80);
        } catch (e) { }
        yOffset += 95;
    });

    // --- Page 4: Vastu Remedies ---
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont('times', 'bold');
    doc.text('Vastu Audit & Remedial Path', margin, 30);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    let vyOffset = 50;

    analysis.violations.forEach((v, i) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(200, 0, 0);
        doc.text(`${i + 1}. ${v.item}`, margin, vyOffset);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const splitIssue = doc.splitTextToSize(`Issue: ${v.issue}`, pageWidth - (margin * 2));
        doc.text(splitIssue, margin, vyOffset + 5);
        vyOffset += 15 + (splitIssue.length * 5);
    });

    vyOffset += 10;
    doc.setFontSize(14);
    doc.setFont('times', 'bold');
    doc.text('Recommended SMM Solutions', margin, vyOffset);
    vyOffset += 10;

    analysis.remedies.forEach((r, i) => {
        if (vyOffset > 250) { doc.addPage(); vyOffset = 30; }
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`Remedy: ${r.action}`, margin, vyOffset);
        doc.setFont('helvetica', 'normal');
        const splitReason = doc.splitTextToSize(r.reason, pageWidth - (margin * 2));
        doc.text(splitReason, margin, vyOffset + 5);
        if (r.smm_product_boost) {
            doc.setTextColor(212, 175, 55);
            doc.text(`Recommended Product: ${r.smm_product_boost}`, margin, vyOffset + 5 + (splitReason.length * 5));
            doc.setTextColor(0, 0, 0);
        }
        vyOffset += 15 + (splitReason.length * 5);
    });

    // Save
    doc.save(`SMM-Aura-Report-${userData.name.replace(/\s+/g, '-')}.pdf`);
};

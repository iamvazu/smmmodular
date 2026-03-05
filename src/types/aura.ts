export interface VastuViolation {
    item: string;
    issue: string;
    impact: string;
}

export interface VastuRemedy {
    action: string;
    reason: string;
    smm_product_boost: string;
}

export interface DetectedObject {
    object: string;
    bbox: number[];
    confidence?: number;
    suggestedSKU?: string;
}

export interface ArchitecturalElement {
    type: 'wall' | 'window' | 'door' | 'opening';
    bbox: number[];
}

export interface DesignFlag {
    category: 'Vastu' | 'Space' | 'Style' | 'Budget' | 'Delivery';
    status: 'Good' | 'Warning' | 'Info';
    text: string;
}

export interface AnalysisResult {
    objects: DetectedObject[];
    architecture?: ArchitecturalElement[];
    vastu_score: number;
    status: 'Auspicious' | 'Neutral' | 'Needs Remedy';
    violations: VastuViolation[];
    remedies: VastuRemedy[];
    summary: string;
    roomType: string;
    layoutAnalysis?: string;
    estimated_price?: number;
    emi_estimate?: number;
    flags?: DesignFlag[];
}

export interface RenderVariation {
    name: string;
    url: string;
}

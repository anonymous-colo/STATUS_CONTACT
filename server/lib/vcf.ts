import { Contact } from "@shared/schema";

export function generateVCF(contacts: Contact[]): string {
  let vcfContent = "";

  for (const contact of contacts) {
    vcfContent += "BEGIN:VCARD\n";
    vcfContent += "VERSION:3.0\n";
    vcfContent += `FN:${contact.fullName}\n`;
    vcfContent += `TEL:${contact.phoneE164}\n`;
    
    if (contact.email) {
      vcfContent += `EMAIL:${contact.email}\n`;
    }
    
    vcfContent += "END:VCARD\n";
  }

  return vcfContent;
}

export function getVCFFilename(): string {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-");
  return `status-contacts-${timestamp}.vcf`;
}

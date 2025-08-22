import { Contact } from "@shared/schema";

export function generateCSV(contacts: Contact[]): string {
  const headers = ["ID", "Nom", "Nom Complet", "Téléphone", "Email", "Date d'inscription"];
  const csvLines = [headers.join(",")];

  for (const contact of contacts) {
    const row = [
      contact.id.toString(),
      `"${contact.name}"`,
      `"${contact.fullName}"`,
      contact.phoneE164,
      contact.email || "",
      contact.createdAt?.toISOString().slice(0, 10) || "",
    ];
    csvLines.push(row.join(","));
  }

  return csvLines.join("\n");
}

export function getCSVFilename(): string {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-");
  return `status-contacts-${timestamp}.csv`;
}

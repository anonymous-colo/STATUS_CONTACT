import JSZip from "jszip";
import fs from "fs/promises";
import path from "path";

export class ProjectZipGenerator {
  private zip: JSZip;

  constructor() {
    this.zip = new JSZip();
  }

  async addFile(filePath: string, content: string) {
    this.zip.file(filePath, content);
  }

  async addDirectory(dirPath: string) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory() && !this.shouldSkipDirectory(entry.name)) {
          await this.addDirectory(fullPath);
        } else if (entry.isFile() && !this.shouldSkipFile(entry.name)) {
          const content = await fs.readFile(fullPath, "utf8");
          const relativePath = path.relative(process.cwd(), fullPath);
          this.zip.file(relativePath, content);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
    }
  }

  private shouldSkipDirectory(name: string): boolean {
    const skipDirs = ["node_modules", ".git", "dist", "build", ".next"];
    return skipDirs.includes(name);
  }

  private shouldSkipFile(name: string): boolean {
    const skipFiles = [".env", ".env.local", "CONTACT_STATUS.zip"];
    const skipExtensions = [".log", ".tmp"];
    
    return skipFiles.includes(name) || 
           skipExtensions.some(ext => name.endsWith(ext));
  }

  async generateZip(): Promise<Buffer> {
    return await this.zip.generateAsync({ type: "nodebuffer" });
  }

  async saveZipToFile(filename: string = "CONTACT_STATUS.zip"): Promise<void> {
    const content = await this.generateZip();
    await fs.writeFile(filename, content);
  }
}

export async function updateProjectZip() {
  try {
    const zipGenerator = new ProjectZipGenerator();
    
    // Add all project files
    await zipGenerator.addDirectory(process.cwd());
    
    // Save the zip file
    await zipGenerator.saveZipToFile("CONTACT_STATUS.zip");
    
    console.log("Project ZIP updated successfully");
  } catch (error) {
    console.error("Failed to update project ZIP:", error);
  }
}

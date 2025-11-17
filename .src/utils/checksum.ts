import { crypto } from "@std/crypto";

export const algorithm = "MD5" as const;

export const fileChecksum = async (
  file: URL | string | Deno.FsFile,
): Promise<string> => {
  const fileContent = file instanceof Deno.FsFile 
    ? await Deno.readAll(file) 
    : await Deno.readFile(file);
  
  const hashBuffer = await crypto.subtle.digest(algorithm, fileContent);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};
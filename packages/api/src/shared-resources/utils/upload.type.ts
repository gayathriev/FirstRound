import { Stream } from "stream";

/**
 * @description
 * An interface for uploading
 * documents and images to
 * firebase
 * 
 * @field filename: the name of the file
 * @field mimetype: the media type of the document
 * @field encoding: how the file is encoded
 * @field createReadStream: creates a readable byte tunnel
 */
export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}
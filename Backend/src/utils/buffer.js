  import {Readable} from "stream"
  import cloudinary from "../config/cloudinary.js";

 export const uploadFromBuffer = (buffer) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "profiles" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    Readable.from(buffer).pipe(stream);
                });
            }
        
            
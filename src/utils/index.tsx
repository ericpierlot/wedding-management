import { supabase } from "../services/supabaseClient";

export const formattedNumber = (number: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
  }).format(number);

export const uploadImageToSupabaseStorage = async (fileObject: File) => {
  try {
    if (!fileObject) {
      throw new Error("You must select an image to upload.");
    }

    const file = fileObject;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }
    return filePath;
  } catch (error: any) {
    throw new Error("Error uploading");
  }
};

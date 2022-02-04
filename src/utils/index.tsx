import { GuestInterface } from "../pages/Guests/Display/Item/Item";
import { Admin } from "../pages/Guests/Guests";
import { supabase } from "../services/supabaseClient";

export const formattedNumber = (number: number | undefined) => {
  if (!number) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
  }).format(number);
};

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

export const getUser = () => {
  return supabase.auth.user();
};

export const getLengthOfGuests = async () => {
  const { count } = await supabase
    .from<GuestInterface>("Guest")
    .select("*", { count: "exact" });
  return count;
};

export const usePermission = () => {
  const user = getUser();
  if (!user) {
    return false;
  }

  if (user.id === Admin.ERIC || user.id === Admin.NATTANICHA) {
    return true;
  }

  return false;
};

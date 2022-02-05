import { GuestInterface } from "../pages/Guests/Display/Item/Item";
import { Admin } from "../pages/Guests/Guests";
import { Booking } from "../pages/Management/Management";
import { supabase } from "../services/supabaseClient";

export const formattedNumber = (
  number: number | undefined,
  currency = "THB"
) => {
  if (!number) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
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

interface UserDatabaseInterface {
  id: number;
  created_at: string;
  googleid: string;
  currency: string;
  linkedwithid: string;
}

export const getTableUser = async () => {
  const id = await getUser()?.id;
  if (!id) return null;
  const { data } = await supabase
    .from<UserDatabaseInterface>("User")
    .select("*")
    .eq("googleid", id);
  return data && data.length > 0 ? data : null;
};

export const getLengthOfGuests = async () => {
  const { count } = await supabase
    .from<GuestInterface>("Guest")
    .select("*", { count: "exact" });
  return count;
};

const getLinkedIdAccount = async (id: string | null) => {
  if (!id) return null;
  const { data } = await supabase
    .from<{ googleid: string; linkedwithid: string }>("User")
    .select("linkedwithid")
    .eq("googleid", id);
  if (data === null) return null;
  return await data[0].linkedwithid;
};

export const fetchBookingOwner = async (id: string | null) => {
  if (!id) return [];
  const tableUser = await getTableUser();

  if (!tableUser) {
    const { data } = await supabase
      .from<Booking>("Booking")
      .select("*")
      .eq(`ownerid`, id)
      .order("created_at");

    if (data === null) return [];
    return data;
  } else if (tableUser[0].linkedwithid !== null) {
    const { data } = await supabase
      .from<Booking>("Booking")
      .select("*")
      .or(`ownerid.eq.${id}, ownerid.eq.${await getLinkedIdAccount(id)}`)
      .order("created_at");

    if (data === null) return [];
    return data;
  }
};

import aisha from "@/assets/students/aisha.jpg";
import ana from "@/assets/students/ana.jpg";
import chloe from "@/assets/students/chloe.jpg";
import daniel from "@/assets/students/daniel.jpg";
import emma from "@/assets/students/emma.jpg";
import isabella from "@/assets/students/isabella.jpg";
import kenji from "@/assets/students/kenji.jpg";
import liam from "@/assets/students/liam.jpg";
import mei from "@/assets/students/mei.jpg";
import noah from "@/assets/students/noah.jpg";
import oliver from "@/assets/students/oliver.jpg";
import sofia from "@/assets/students/sofia.jpg";

const photosByFirstName: Record<string, string> = {
  aisha,
  ana,
  chloé: chloe,
  chloe,
  daniel,
  emma,
  isabella,
  kenji,
  liam,
  mei,
  noah,
  oliver,
  sofia,
};

export function studentPhoto(student: { name: string; avatar_url?: string | null }): string | null {
  if (student.avatar_url) return student.avatar_url;
  const first = student.name.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  return photosByFirstName[first] ?? null;
}

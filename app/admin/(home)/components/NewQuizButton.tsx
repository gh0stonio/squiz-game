'use client';
import 'client-only';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewQuizButton() {
  const router = useRouter();

  return (
    <Link href="/admin/form" className="btn-secondary btn-sm btn">
      New Quiz
    </Link>
  );
}

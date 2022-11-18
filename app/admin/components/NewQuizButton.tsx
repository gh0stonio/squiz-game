'use client';
import 'client-only';
import { useRouter } from 'next/navigation';

export default function NewQuizButton() {
  const router = useRouter();

  return (
    <button
      className="btn-secondary btn-sm btn"
      onClick={() => router.push('/admin/form')}
    >
      New Quiz
    </button>
  );
}

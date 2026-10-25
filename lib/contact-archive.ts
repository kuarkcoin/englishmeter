type ContactMessage = { name: string; email: string; message: string };
type SaveMessage = (message: ContactMessage) => Promise<unknown>;

const saveWithPrisma: SaveMessage = async (message) => {
  const { prisma } = await import("./prisma");
  return prisma.contactMessage.create({ data: message });
};

// The email has already been accepted. Archiving is best effort; a slow database
// must not make the visitor retry an email that was already sent.
export async function archiveContactMessage(
  message: ContactMessage,
  save: SaveMessage = saveWithPrisma,
  timeoutMs = 2000,
): Promise<boolean> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      save(message).then(() => true, () => false),
      new Promise<boolean>((resolve) => {
        timer = setTimeout(() => resolve(false), timeoutMs);
      }),
    ]);
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

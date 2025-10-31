import { MotionDiv } from "./ui/motion";

export default function EmptyState({
  text,
  animationKey,
}: {
  text: string;
  animationKey?: string;
}) {
  return (
    <MotionDiv
      key={animationKey}
      className="p-4 text-center border rounded-lg text-muted-foreground"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {text}
    </MotionDiv>
  );
}

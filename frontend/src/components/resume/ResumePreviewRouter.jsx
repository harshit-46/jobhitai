import { useResume } from "./ResumeContext";
import ResumePreviewModern from "./ResumePreviewModern";
import ResumePreviewClassic from "./ResumePreviewClassic";

export default function ResumePreview() {
    const { resume } = useResume();
    return resume.template === "classic"
        ? <ResumePreviewClassic />
        : <ResumePreviewModern />;
}
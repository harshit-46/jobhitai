import pickle
import numpy as np
from fastapi import HTTPException

model = None
vectorizer = None
lb = None

def load_models():
    global model, vectorizer, lb
    if model is None:
        model = pickle.load(open("models/model.pkl", "rb"))
        vectorizer = pickle.load(open("models/cv.pkl", "rb"))
        lb = pickle.load(open("models/label_encoder.pkl", "rb"))

def get_top_predictions(skills_vector, top_n=3):
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(skills_vector)[0]

        top_idx = np.argsort(probs)[::-1][:top_n]
        top_jobs = lb.inverse_transform(top_idx)
        top_scores = [round(float(probs[i] * 100), 1) for i in top_idx]

    else:
        prediction = model.predict(skills_vector)
        top_jobs = [lb.inverse_transform(prediction)[0]]
        top_scores = [100.0]

    return list(zip(top_jobs, top_scores))

def match_skills(skills: str):
    load_models()

    skills = skills.strip().lower()

    if not skills:
        raise HTTPException(status_code=400, detail="Please enter skills")

    try:
        skills_vector = vectorizer.transform([skills])

        top_predictions = get_top_predictions(skills_vector)

        best_job, best_score = top_predictions[0]
        other_predictions = top_predictions[1:]

        # Verdict logic
        if best_score >= 75:
            verdict = {"label": "Strong Match", "type": "strong"}
        elif best_score >= 45:
            verdict = {"label": "Moderate Match", "type": "moderate"}
        else:
            verdict = {"label": "Low Confidence", "type": "low"}

        return {
            "best_role": best_job,
            "confidence": best_score,
            "verdict": verdict,
            "others": [
                {"role": r, "confidence": s}
                for r, s in other_predictions
            ]
        }

    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(status_code=500, detail="Prediction failed")
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt

import json
import os

from groq import Groq
from reportlab.pdfgen import canvas


# ---------------- GROQ ----------------

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# ---------------- HOME ----------------

def home(request):
    return render(request, "index.html")


# ---------------- AI GENERATE ----------------

@csrf_exempt
def generate(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "error": "Only POST request allowed"
        })

    try:

        data = json.loads(request.body)

        event_name = data.get("event_name")
        theme = data.get("theme")

        prompt = f"""
You are a professional Event Planner AI.

Create a complete event plan.

Event Name:
{event_name}

Theme:
{theme}

Return ONLY valid JSON.

{{
    "event_title":"",
    "decorations":[
        "",
        "",
        "",
        ""
    ],
    "activities":[
        "",
        "",
        "",
        ""
    ],
    "poster_content":"",
    "tagline":"",
    "budget":"",
    "timeline":[
        {{
            "Morning":""
        }},
        {{
            "Afternoon":""
        }},
        {{
            "Evening":""
        }}
    ],
    "checklist":[
        "",
        "",
        "",
        ""
    ]
}}

Rules:

1. Decorations must exactly match the theme.

2. Activities must exactly match the event.

3. Poster content should be attractive.

4. Tagline should be catchy.

5. Budget must be in Indian Rupees.

6. Timeline must contain Morning, Afternoon and Evening.

7. Checklist must contain required items.

8. Return ONLY JSON.

9. No markdown.

10. No explanation.
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert event planner. Always return only valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7
        )

        ai_output = response.choices[0].message.content

        # Remove markdown if AI returns it
        ai_output = (
            ai_output
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        return JsonResponse({
            "success": True,
            "output": ai_output
        })

    except Exception as e:

        return JsonResponse({
            "success": False,
            "error": str(e)
        })


# ---------------- PDF DOWNLOAD ----------------

@csrf_exempt
def download_pdf(request):

    if request.method != "POST":
        return HttpResponse("Invalid Request")

    try:

        data = json.loads(request.body)

        event_title = data.get("event_title", "")
        decorations = data.get("decorations", [])
        activities = data.get("activities", [])
        poster_content = data.get("poster_content", "")
        tagline = data.get("tagline", "")
        budget = data.get("budget", "")
        timeline = data.get("timeline", [])
        checklist = data.get("checklist", [])

        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = 'attachment; filename="event_plan.pdf"'

        pdf = canvas.Canvas(response)

        y = 800

        pdf.setFont("Helvetica-Bold", 18)
        pdf.drawString(180, y, "AI EVENT PLAN")
        y -= 40

        pdf.setFont("Helvetica-Bold", 13)
        pdf.drawString(40, y, "Event Title")
        pdf.setFont("Helvetica", 12)
        pdf.drawString(150, y, event_title)
        y -= 30

        pdf.setFont("Helvetica-Bold", 13)
        pdf.drawString(40, y, "Decorations")
        y -= 20

        pdf.setFont("Helvetica", 12)
        for item in decorations:
            pdf.drawString(60, y, f"• {item}")
            y -= 18

        y -= 10

        pdf.setFont("Helvetica-Bold", 13)
        pdf.drawString(40, y, "Activities")
        y -= 20

        pdf.setFont("Helvetica", 12)
        for item in activities:
            pdf.drawString(60, y, f"• {item}")
            y -= 18

        y -= 10

        pdf.setFont("Helvetica-Bold", 13)
        pdf.drawString(40, y, "Poster Content")
        y -= 20

        pdf.setFont("Helvetica", 12)
        pdf.drawString(60, y, poster_content)
        y -= 30

        pdf.setFont("Helvetica-Bold", 13)
        pdf.drawString(40, y, "Tagline")
        y -= 20

        pdf.setFont("Helvetica", 12)
        pdf.drawString(60, y, tagline)
        y -= 30

        pdf.setFont("Helvetica-Bold", 13)
        pdf.drawString(40, y, "Budget")
        y -= 20

        pdf.setFont("Helvetica", 12)
        pdf.drawString(60, y, budget)
        y -= 30

        pdf.setFont("Helvetica-Bold", 13)
        pdf.drawString(40, y, "Timeline")
        y -= 20

        pdf.setFont("Helvetica", 12)

        for item in timeline:

            if isinstance(item, dict):

                for key, value in item.items():
                    pdf.drawString(60, y, f"{key}: {value}")
                    y -= 18

            else:

                pdf.drawString(60, y, str(item))
                y -= 18

        y -= 10

        pdf.setFont("Helvetica-Bold", 13)
        pdf.drawString(40, y, "Checklist")
        y -= 20

        pdf.setFont("Helvetica", 12)

        for item in checklist:
            pdf.drawString(60, y, f"✓ {item}")
            y -= 18

        pdf.save()

        return response

    except Exception as e:

        return HttpResponse(str(e))
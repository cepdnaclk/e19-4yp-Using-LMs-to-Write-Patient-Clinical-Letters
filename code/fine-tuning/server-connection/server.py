from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import PeftModel, PeftConfig

# FastAPI setup
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
BASE_MODEL = "unsloth/Llama-3.2-3B-bnb-4bit"
ADAPTER_PATH = "./llama-3b-prefix-soap"

# Load tokenizer and model
bnb_config = BitsAndBytesConfig(load_in_8bit=True)  # Or use load_in_4bit=True if needed

tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
tokenizer.pad_token = tokenizer.eos_token

# Use device cuda:0 explicitly
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

base_model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    quantization_config=bnb_config,
    device_map={"": 0}
)

model = PeftModel.from_pretrained(base_model, ADAPTER_PATH)
model.eval()
model.to(device)

# Request schema
class PromptRequest(BaseModel):
    prompt: str

# Chat endpoint
@app.post("/chat")
def generate_response(request: PromptRequest):
    prompt = "Summarize the following medical dialogue into a SOAP note:\n" + request.prompt

    # Tokenize and move to correct device
    inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True, max_length=1024)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    # Generate response
    with torch.no_grad():
        outputs = model.generate(
            input_ids=inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            max_new_tokens=256,
            do_sample=True,
            top_p=0.9,
            temperature=0.7
        )

    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return {"response": response}

# Using Language Models to Generate Patient Clinical Letters

## Team

- **E/19/253** [Narasinghe N.K.B.I.U.](https://github.com/Isira-Udantha) - [Email](mailto:e19253@eng.pdn.ac.lk)
- **E/19/431** [Wickramaarachchi I.W.A.P.D.](https://github.com/Prageeth-Dananjaya) - [Email](mailto:e19431@eng.pdn.ac.lk)
- **E/19/465** [Dilshan R.M.S.](https://github.com/e19465) - [Email](mailto:e19465@eng.pdn.ac.lk)

## Supervisors

- **Dr. Asitha Bandaranayake** - [Email](mailto:asithab@eng.pdn.ac.lk)
- **Dr. Damayanthi Herath** - [Email](mailto:damayanthiherath@eng.pdn.ac.lk)
- **Prof. Shenal Thalgahagoda** - [Email](mailto:)

---

## Table of Contents

1. [Abstract](#abstract)
2. [Related Works](#related-works)
3. [Methodology](#methodology)
4. [Experiment Setup and Implementation](#experiment-setup-and-implementation)
5. [Results and Analysis](#results-and-analysis)
6. [Conclusion](#conclusion)
7. [Publications](#publications)
8. [Links](#links)

---

## Abstract

Language models (LMs) have transformed numerous industries due to their ability to generate human-like text. However, their implementation in healthcare remains a challenge due to concerns regarding data privacy, security, and computational constraints. Clinical documentation is a time-intensive task for physicians, making automated assistance a potential solution for reducing workload while enhancing efficiency.

This research introduces an AI-powered system that utilizes a small language model (SLM) to assist healthcare professionals in generating clinical letters. By leveraging an optimized model for low-resource environments and implementing robust privacy-preserving techniques, our approach ensures secure and efficient clinical documentation. The system strikes a balance between performance, privacy, and accessibility, making it an ideal solution for healthcare professionals in diverse settings.

---

## Related Works

The development of AI-assisted clinical documentation encompasses several critical components, including model architectures, privacy techniques, data processing, fine-tuning strategies, and evaluation methodologies.

### Model Architectures and System Designs
- Transformer-based models such as **EriBERTa** and **Longformer** efficiently handle long-form text generation.
- Selective State Space Models (SSMs) offer computational efficiency by leveraging state-space representations.
- Retrieval-Augmented Generation (RAG) models enhance context retention and accuracy.

### Privacy-Preserving Techniques
- Implementation of **differential privacy**, **federated learning**, and **local model deployment** ensures compliance with regulatory standards such as **HIPAA** and **GDPR**.

### Prompting Techniques
- Utilizing **zero-shot**, **one-shot**, and **few-shot prompting** for structured and contextually relevant outputs.
- Advanced methods such as **iterative refinement**, **prompt chaining**, and **prompt ensembling** improve quality.

### Data Processing and Fine-Tuning
- **Data augmentation**, **normalization**, and **knowledge base construction (KBC)** enhance input quality.
- **Parameter-Efficient Fine-Tuning (PEFT)** techniques such as **LoRA** and **QLoRA** optimize computational efficiency.

### Evaluation Criteria
- **Automated metrics**: ROUGE, BLEU, BERTScore.
- **Human evaluation**: Expert clinician reviews.

---

## Methodology

Our research follows a structured approach to ensure accuracy, privacy, and efficiency in clinical letter generation.

![image](https://github.com/user-attachments/assets/49afb5e0-c844-453b-8f55-e8417e5a8f2b)


### Key Steps:
1. **Synthetic Data Generation**: Using large language models (LLMs) to generate diverse medical case data.
2. **Data Quality Enhancement**: Standardizing terminology, and structuring input text.
3. **Privacy Protection**: Implementing anonymization and differential privacy measures.
4. **Bias Mitigation**: Applying prefix tuning to minimize model bias.
5. **Efficient Model Training**: Leveraging LoRA for parameter-efficient fine-tuning.
6. **Quality Assurance**: Utilizing output refinement and multi-model evaluations to ensure accuracy.

---

## Experiment Setup and Implementation

(Details to be added, including dataset descriptions, model configurations, and training parameters.)

---

## Results and Analysis

(Details to be added, including performance metrics, qualitative assessments, and comparative analysis.)

---

## Conclusion

(Details to be added, summarizing findings and future work.)

---

## Publications

(Will include links to reports, research papers, and conference proceedings once published.)

---

## Links

- **[Project Repository](https://github.com/cepdnaclk/e19-4yp-Using-LMs-to-Write-Patient-Clinical-Letters)**
- **[Project Page](https://cepdnaclk.github.io/e19-4yp-Using-LMs-to-Write-Patient-Clinical-Letters/)**
- **[Department of Computer Engineering](http://www.ce.pdn.ac.lk/)**
- **[University of Peradeniya](https://eng.pdn.ac.lk/)**

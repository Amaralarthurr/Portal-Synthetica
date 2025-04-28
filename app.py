from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from enum import Enum
import uuid

app = FastAPI()

# Habilitar CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Definir categorias como enum
class Categoria(str, Enum):
    TECNOLOGIA = "Avanços Tecnológicos"
    CULTURA = "IA na Arte e Cultura"

# Modelo de dados para conteúdo
class ConteudoBase(BaseModel):
    titulo: str
    descricao: str
    categoria: Categoria

class ConteudoCreate(ConteudoBase):
    pass

class Conteudo(ConteudoBase):
    id: str
    
    class Config:
        orm_mode = True

# Lista em memória
db_conteudos = [
    {
        "id": "1",
        "titulo": "Interface Neural Não-Invasiva",
        "descricao": "Cientistas desenvolveram uma interface neural não invasiva que permite comunicação direta entre cérebros humanos e sistemas de IA.",
        "categoria": Categoria.TECNOLOGIA
    },
    {
        "id": "2",
        "titulo": "Compositores de IA Redefinindo a Música",
        "descricao": "Como a inteligência artificial está criando novos gêneros musicais e colaborando com artistas humanos para expandir fronteiras criativas.",
        "categoria": Categoria.CULTURA
    }
]

# Rotas da API

@app.get("/conteudos", response_model=List[Conteudo])
def listar_conteudos():
    return db_conteudos

@app.get("/conteudos/{conteudo_id}", response_model=Conteudo)
def obter_conteudo(conteudo_id: str):
    for conteudo in db_conteudos:
        if conteudo["id"] == conteudo_id:
            return conteudo
    raise HTTPException(status_code=404, detail="Conteúdo não encontrado")

@app.post("/conteudos", response_model=Conteudo)
def criar_conteudo(conteudo: ConteudoCreate):
    novo_conteudo = conteudo.dict()
    novo_conteudo["id"] = str(uuid.uuid4())
    db_conteudos.append(novo_conteudo)
    return novo_conteudo

@app.put("/conteudos/{conteudo_id}", response_model=Conteudo)
def atualizar_conteudo(conteudo_id: str, conteudo: ConteudoCreate):
    for i, item in enumerate(db_conteudos):
        if item["id"] == conteudo_id:
            db_conteudos[i] = {**conteudo.dict(), "id": conteudo_id}
            return db_conteudos[i]
    raise HTTPException(status_code=404, detail="Conteúdo não encontrado")

@app.delete("/conteudos/{conteudo_id}")
def remover_conteudo(conteudo_id: str):
    for i, item in enumerate(db_conteudos):
        if item["id"] == conteudo_id:
            db_conteudos.pop(i)
            return {"message": "Conteúdo removido com sucesso"}
    raise HTTPException(status_code=404, detail="Conteúdo não encontrado")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
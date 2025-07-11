from dataclasses import dataclass
from typing import List

@dataclass
class Flujo:
    step1Id: str
    step1Desc: str
    step2Id: str
    step2Desc: str

@dataclass
class FlujoAlterno:
    id: str
    desc: str

num_caso_uso = 1
@dataclass
class CasoDeUso:
    titulo: str
    actores: str
    tipo: str
    requisitos: str
    casoDeUso: str
    precondicion: str
    postcondicion: str
    proposito: str
    resumen: str
    flujo: List[Flujo]
    flujoAlterno: List[FlujoAlterno]
    frecuencia: str
    rendimiento: str
    importancia: str
    urgencia: str
    estado: str
    estabilidad: str
    comentarios: str

    def __str__(self):
        global num_caso_uso
        with open('caso_de_uso_pattern.tex', 'r', encoding='utf-8') as pattern_file:
            cu_text = pattern_file.read()
            cu_text = cu_text.replace('#titulo', self.titulo)
            cu_text = cu_text.replace('#id', f'CU-{num_caso_uso:02d}')
            num_caso_uso = num_caso_uso + 1
            cu_text = cu_text.replace('#actores', self.actores)
            cu_text = cu_text.replace('#tipo', self.tipo)
            cu_text = cu_text.replace('#requisitos', self.requisitos)
            cu_text = cu_text.replace('#casoDeUso', self.casoDeUso)
            cu_text = cu_text.replace('#precondicion', self.precondicion)
            cu_text = cu_text.replace('#postcondicion', self.postcondicion)
            cu_text = cu_text.replace('#proposito', self.proposito)
            cu_text = cu_text.replace('#resumen', self.resumen)
            cu_text = cu_text.replace('#flujo', PrintFlujo(self.flujo), 1)
            cu_text = cu_text.replace('#flujoAlterno', PrintFlujoAlterno(self.flujoAlterno))
            cu_text = cu_text.replace('#frecuencia', self.frecuencia)
            cu_text = cu_text.replace('#rendimiento', self.rendimiento)
            cu_text = cu_text.replace('#importancia', self.importancia)
            cu_text = cu_text.replace('#urgencia', self.urgencia)
            cu_text = cu_text.replace('#estado', self.estado)
            cu_text = cu_text.replace('#estabilidad', self.estabilidad)
            cu_text = cu_text.replace('#comentarios', self.comentarios)
            return cu_text
    
def PrintFlujo(flujo: List[Flujo]):
    flujo_str = ''
    for line in flujo:
        flujo_str = flujo_str + fr'      {line.step1Id} & {line.step1Desc} & {line.step2Id} & {line.step2Desc} \\'+'\n'
        flujo_str = flujo_str + fr'      \hline' + '\n'
    return flujo_str

def PrintFlujoAlterno(flujo: List[FlujoAlterno]):
    flujo_str = ''
    for line in flujo:
        desc = r'\multicolumn{3}{|>{\raggedright\arraybackslash}X|}{'+ line.desc + '}'
        flujo_str = flujo_str + fr'      {line.id} & {desc} \\'+'\n'
        flujo_str = flujo_str + fr'      \hline' + '\n'
    return flujo_str
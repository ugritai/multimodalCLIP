
from CasosDeUsoData import casos_de_uso

if __name__ == '__main__':
    with open('casos_de_uso.tex', 'w', encoding='utf-8') as f:
        for cu in casos_de_uso:
            f.write(str(cu))
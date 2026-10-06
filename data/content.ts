// Dados de exemplo — substitua pelas peças e eventos reais da Faísca.
// As fotos vêm de /public/images. Para trocar uma imagem, coloque o arquivo novo
// nessa pasta e altere o caminho no campo `image` ou `hoverImage` da peça.

export type Product = {
  id: string
  name: string
  category: 'Velas' | 'Castiçais' | 'Kits' | 'Peças únicas'
  material: string
  price: number
  description: string
  image: string
  hoverImage: string
  stock: number
  specs: { label: string; value: string }[]
  artist: string
}

export type EventImage = { src: string; width: number; height: number; alt: string }

export type EventItem = {
  id: string
  date: string
  title: string
  details: string
  location: string
  image?: string
  images?: EventImage[]
  past?: boolean
}

const img = (name: string) => `/images/${name}.jpg`

// Fotos disponíveis (provisórias, até chegarem as fotos de cada peça):
// cacho      — mão segurando um cacho de velas, fundo azul
// fio-azul   — fio de cera ondulando sobre o azul
// pavios     — velas pendentes em uma barra
// castical, castical-topo, castical-base — castiçais de ferro, fundo terracota
// pirita     — pedra dourada na palma da mão
export const products: Product[] = [
  { id: 'brasa', name: 'Brasa baixa', category: 'Velas', material: 'Cera vegetal, pigmento mineral', price: 148, description: 'Uma chama pequena para acompanhar o fim do dia.', image: img('fio-azul'), hoverImage: img('cacho'), stock: 12, specs: [{ label: 'Medidas', value: 'Ø 8 × 9 cm' }, { label: 'Material', value: 'Cera de soja e algodão' }, { label: 'Queima', value: 'aprox. 38 horas' }, { label: 'Cuidados', value: 'Apare o pavio a cada uso' }], artist: 'Gio Soifer' },
  { id: 'azul', name: 'Azul de dentro', category: 'Velas', material: 'Cera vegetal, ilustração manual', price: 178, description: 'Uma peça azul-cobalto, desenhada como quem guarda uma paisagem.', image: img('cacho'), hoverImage: img('pavios'), stock: 5, specs: [{ label: 'Medidas', value: 'Ø 7 × 12 cm' }, { label: 'Material', value: 'Cera vegetal' }, { label: 'Queima', value: 'aprox. 42 horas' }, { label: 'Cuidados', value: 'Apare o pavio a cada uso' }], artist: 'Saha' },
  { id: 'sete', name: 'Sete voltas', category: 'Velas', material: 'Cera de abelha, pigmento', price: 220, description: 'Uma forma espiral que muda enquanto acende.', image: img('pavios'), hoverImage: img('fio-azul'), stock: 7, specs: [{ label: 'Medidas', value: '8 × 8 × 14 cm' }, { label: 'Material', value: 'Cera de abelha' }, { label: 'Queima', value: 'aprox. 18 horas' }, { label: 'Cuidados', value: 'Queimar sobre uma base' }], artist: 'Gio Soifer' },
  { id: 'marco', name: 'Marco', category: 'Castiçais', material: 'Ferro', price: 260, description: 'Um suporte alto e fino para a luz pousar.', image: img('castical'), hoverImage: img('castical-base'), stock: 4, specs: [{ label: 'Medidas', value: '12 × 8 × 4 cm' }, { label: 'Material', value: 'Ferro' }, { label: 'Queima', value: '—' }, { label: 'Cuidados', value: 'Limpar com pano macio' }], artist: 'Corpo-Miragem' },
  { id: 'dobra', name: 'Dobra', category: 'Castiçais', material: 'Ferro soldado', price: 310, description: 'Uma forquilha precisa que segura a vela no alto.', image: img('castical-topo'), hoverImage: img('castical'), stock: 9, specs: [{ label: 'Medidas', value: '10 × 10 × 14 cm' }, { label: 'Material', value: 'Ferro' }, { label: 'Queima', value: '—' }, { label: 'Cuidados', value: 'Evitar água em excesso' }], artist: 'Saha' },
  { id: 'sul', name: 'Sul', category: 'Castiçais', material: 'Ferro e base de chapa', price: 285, description: 'Uma haste simples sobre uma base firme.', image: img('castical-base'), hoverImage: img('castical-topo'), stock: 3, specs: [{ label: 'Medidas', value: 'Ø 9 × 11 cm' }, { label: 'Material', value: 'Ferro' }, { label: 'Queima', value: '—' }, { label: 'Cuidados', value: 'Evitar água em excesso' }], artist: 'Gio Soifer' },
  { id: 'primeiro-fogo', name: 'Primeiro fogo', category: 'Kits', material: 'Cera, ferro e papel', price: 420, description: 'Velas, um castiçal e fósforos para começar o ritual.', image: img('cacho'), hoverImage: img('castical'), stock: 6, specs: [{ label: 'Inclui', value: 'Velas, castiçal e carteira' }, { label: 'Material', value: 'Cera, ferro e papel' }, { label: 'Queima', value: 'aprox. 30 horas' }, { label: 'Cuidados', value: 'Seguir instruções inclusas' }], artist: 'Faísca' },
  { id: 'rastro', name: 'Rastro', category: 'Peças únicas', material: 'Cera pigmentada', price: 390, description: 'Uma peça irrepetível, feita diretamente na cera.', image: img('fio-azul'), hoverImage: img('pavios'), stock: 1, specs: [{ label: 'Medidas', value: 'Ø 10 × 16 cm' }, { label: 'Material', value: 'Cera vegetal' }, { label: 'Queima', value: 'aprox. 50 horas' }, { label: 'Cuidados', value: 'Peça única, manusear com cuidado' }], artist: 'Corpo-Miragem' },
]

export const events: EventItem[] = [
  {
    id: 'lava-pes',
    date: '10 out · 10h',
    title: 'Lava Pés e Manteigasso',
    details: 'Faísca convida Saha e Corpo-Miragem.',
    location: 'Atelier Gio Soifer',
    images: [
      { src: img('jarra-bacia'), width: 1800, height: 889, alt: 'Jarra de cerâmica verde ao lado de uma bacia branca, sobre fundo azul' },
      { src: img('maos'), width: 1800, height: 1061, alt: 'Duas mãos com óleo, uma sobre a outra, sobre fundo azul' },
    ],
  },
  { id: 'noite-luz', date: '22 nov · 19h', title: 'Noite para acender', details: 'Uma mesa, quatro artistas, muitas chamas.', location: 'Casa Faísca' },
  { id: 'arquivo-1', date: '15 ago · 2025', title: 'A matéria da chama', details: 'Encontro de modelagem e desenho.', location: 'Atelier Gio Soifer', image: img('arquivo-materia'), past: true },
  { id: 'arquivo-2', date: '02 jun · 2025', title: 'Acender junto', details: 'Uma tarde de objetos, conversa e fogo.', location: 'Casa Faísca', image: img('arquivo-junto'), past: true },
]

export const formatPrice = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export const heroImage = img('cacho')
export const aboutImage = img('pirita')

export const star = '✶'

export type CartItem = { product: Product; quantity: number }

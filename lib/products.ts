/**
 * Catálogo da Faísca.
 *
 * Tudo o que aparece na loja sai daqui: nome, preço, estoque inicial da fornada,
 * textos da página de produto e combinações. Para lançar uma fornada nova,
 * edite este arquivo e faça um novo deploy.
 *
 * PREÇOS: em centavos (R$ 180,00 = 18000). Enquanto o preço for 0, o produto
 * aparece como "Preço em breve" e não pode ser comprado.
 *
 * Dados da planilha de peças (Figma › Branding › Peças): nome, acabamento,
 * medidas, peso, quantidade e valor. O custo fica fora do site.
 */

export type Category = 'velas' | 'mergulho' | 'objetos';

export const CATEGORIES: Record<Category, string> = {
  velas: 'Velas em cerâmica',
  mergulho: 'Velas de mergulho',
  objetos: 'Objetos',
};

/** Cores da ilustração do pote, enquanto não houver fotos. */
export type VesselArt = {
  body: string;
  rim: string;
  paint: string;
  bg: string;
};

export type Product = {
  slug: string;
  name: string;
  category: Category;
  /** Preço em centavos. 0 = ainda sem preço (não vendável). */
  price: number;
  /** Peças na fornada atual. Com o banco ligado, o estoque real fica lá. */
  stock: number;
  /** Quem fez: "Faísca" nas peças próprias, o nome do artista nos convidados. */
  maker: string;
  edition: string;
  /** Uma linha logo abaixo do nome. */
  tagline: string;
  description: string;
  /** Ficha técnica, na ordem em que aparece. */
  details: { label: string; value: string }[];
  /** Como usar: o ritual sugerido para a peça. */
  ritual: string;
  /** Texto de cuidados ou "depois da chama". */
  care: { title: string; text: string };
  /** Slugs dos produtos sugeridos em "Combina com". */
  pairsWith: string[];
  /** Recorte sem fundo (PNG/WebP), usado na mesa da home, na sacola e quando não há foto. */
  image?: string;
  /** Fotos da página de produto, na ordem. A primeira também aparece na Loja. */
  photos?: { src: string; alt: string }[];
  /** Feito sob encomenda: sem preço fixo, o botão leva para a conversa no Instagram. */
  sobEncomenda?: boolean;
  art?: VesselArt;
  imageAlt: string;
  /**
   * Parte vazia embaixo da imagem (0 a 1), para o objeto "pousar" na linha da mesa
   * na galeria do celular. Com fotos recortadas em PNG rente à base, use 0.
   */
  ground?: number;
  /** Largura do objeto na mesa da home, em px numa fileira de 1340px. Mantém a escala real entre as peças. */
  mesa?: number;
  /** Aparece na home do celular. As demais ficam só na Loja ("Ver todos os objetos"). */
  destaque?: boolean;
};

const CERA = 'Blend de ceras naturais (abelha, palma e coco), aromatizado com perfume autoral';
const DEPOIS_DA_CHAMA =
  'Quando a cera acabar, o pote fica. Vire-o de cabeça para baixo: a base tem um encaixe para velas de mergulho e vira castiçal. Para limpar o resto de cera, use água quente.';
const RITUAL_VELA =
  'Escolha um gesto do dia (o café, a mesa posta, a leitura antes de dormir) e acenda junto. Na primeira vez, deixe queimar até a cera derreter de borda a borda; antes de acender de novo, apare o pavio. Nunca deixe a chama sozinha.';

type VelaInput = {
  slug: string; name: string; acabamento: string; medidas: string; peso: string; price: number; stock: number;
  mesa: number; destaque?: boolean; pavios?: number; vira?: boolean; extra?: string[]; alt: string;
  /** Do outro lado da peça, quando ela tem encaixe para vela de mergulho. */
  verso?: string;
};

/** Vela em pote de cerâmica feito à mão. */
function vela(v: VelaInput): Product {
  const n = 1 + (v.extra?.length ?? 0);
  return {
    slug: v.slug,
    name: v.name,
    category: 'velas',
    price: v.price,
    stock: v.stock,
    maker: 'Faísca',
    edition: 'Fornada 01',
    tagline: v.acabamento,
    description:
      'Vela composta com um blend de ceras naturais (abelha, palma e coco), aromatizada com perfume autoral, num pote modelado à mão. Peça única: a sua é exatamente a da foto.',
    details: [
      { label: 'Acabamento', value: v.acabamento },
      { label: 'Medidas', value: v.medidas },
      { label: 'Peso', value: v.peso },
      { label: 'Cera', value: CERA },
      { label: 'Pavio', value: (v.pavios ?? 1) === 1 ? '1 pavio de algodão' : `${v.pavios} pavios de algodão` },
      ...(v.verso ? [{ label: 'Verso', value: v.verso }] : []),
    ],
    ritual: RITUAL_VELA,
    care: v.vira
      ? { title: 'Depois da chama', text: DEPOIS_DA_CHAMA }
      : { title: 'Depois da chama', text: 'Quando a cera acabar, o pote fica: limpe o resto de cera com água quente e use para guardar fósforos, incenso ou uma flor.' },
    pairsWith: [],
    image: `/images/produtos/${v.slug}/recorte.webp`,
    imageAlt: v.alt,
    photos: Array.from({ length: n }, (_, i) => ({
      src: `/images/produtos/${v.slug}/${i + 1}.webp`,
      alt: i === 0 ? v.alt : v.extra![i - 1],
    })),
    ground: 0,
    mesa: v.mesa,
    destaque: v.destaque ?? false,
  };
}

/**
 * Na ordem da galeria da home: as 7 primeiras na primeira fileira da mesa, as 6
 * seguintes na segunda. As velas de mergulho e os objetos de metal saíram por enquanto
 * (não estão à venda na Loja Integrada); para voltar, recadastre-os aqui e em lib/lojaIntegrada.ts.
 * Preços em centavos.
 */
export const PRODUCTS: Product[] = [
  vela({ slug: 'ambi', name: 'Ambi', acabamento: 'Porcelana com esmalte de alta temperatura', medidas: '10 cm × 7,5 cm', peso: '187 g', price: 8000, stock: 1, mesa: 115, vira: true,
    alt: 'Vela Ambi num pote de porcelana esmaltada em tons de cobre e verde, em forma de chapéu', extra: ['O pote do Ambi virado, como castiçal'] }),
  vela({ slug: 'redondinho', name: 'Redondinho', acabamento: 'Terracota', medidas: '6,5 cm × 7 cm', peso: '161 g', price: 7000, stock: 1, mesa: 90, destaque: true, vira: true,
    alt: 'Vela Redondinho numa taça de terracota com pé', extra: ['O pote do Redondinho virado, como castiçal'] }),
  vela({ slug: 'vulcao-azul', name: 'Vulcão Mar', acabamento: 'Terracota com esmalte de alta temperatura', medidas: '8 cm × 5 cm', peso: '97 g', price: 7000, stock: 1, mesa: 163, vira: true,
    verso: 'Encaixe para vela de mergulho (vendida separadamente)',
    alt: 'Vela Vulcão Mar num pote de terracota com esmalte azul-escuro', extra: ['O pote do Vulcão Mar virado, como castiçal', 'O Vulcão Mar como castiçal, com uma vela de mergulho'] }),
  vela({ slug: 'potinho', name: 'Potinho', acabamento: 'Terracota com acabamento interno em esmalte de alta temperatura', medidas: '7,5 cm × 4 cm', peso: '186 g', price: 7000, stock: 1, mesa: 118,
    alt: 'Vela Potinho numa tigela de terracota com borda esmaltada' }),
  vela({ slug: 'anciao-rio', name: 'Ancião Rio', acabamento: 'Terracota com detalhes em esmalte de alta temperatura', medidas: '8,5 cm × 4 cm', peso: '123,5 g', price: 7500, stock: 1, mesa: 135, vira: true,
    alt: 'Vela Ancião Rio num pote de terracota com faixas azul e verde', extra: ['O pote do Ancião Rio virado, como castiçal'] }),
  vela({ slug: 'anciao-colar', name: 'Ancião Colar', acabamento: 'Terracota com adorno em murano e madrepérola', medidas: '8 cm × 6 cm × 8,5 cm', peso: '141 g', price: 8500, stock: 1, mesa: 160, destaque: true,
    alt: 'Vela Ancião Colar num pedestal de terracota com colar de contas de murano e madrepérola' }),
  vela({ slug: 'anciao-alcas', name: 'Ancião Alças', acabamento: 'Terracota', medidas: '11,5 cm × 13 cm', peso: '260 g', price: 8000, stock: 1, mesa: 140, destaque: true, vira: true,
    verso: 'Encaixe para vela de mergulho (vendida separadamente)',
    alt: 'Ancião Alças fechado: pote de terracota com alças e tampa com alça', extra: ['A tampa do Ancião Alças, sozinha', 'O pote do Ancião Alças com a vela', 'A tampa do Ancião Alças como castiçal, com uma vela de mergulho'] }),
  vela({ slug: 'vulcao-p', name: 'Vulcão P', acabamento: 'Terracota', medidas: '7,5 cm × 3 cm', peso: '68 g', price: 7000, stock: 1, mesa: 172, destaque: true, vira: true,
    alt: 'Vela Vulcão P num pote baixo de terracota com borda ondulada', extra: ['O pote do Vulcão P virado, como castiçal'] }),
  vela({ slug: 'vulcao-m', name: 'Vulcão M', acabamento: 'Terracota', medidas: '9,5 cm × 3,5 cm', peso: '130 g', price: 7000, stock: 1, mesa: 178, vira: true,
    alt: 'Vela Vulcão M num pote de terracota facetado', extra: ['O pote do Vulcão M virado, como castiçal'] }),
  vela({ slug: 'vulcao-gg', name: 'Vulcão GG', acabamento: 'Terracota', medidas: '9 cm × 5 cm', peso: '97,7 g', price: 7000, stock: 1, mesa: 157, vira: true,
    alt: 'Vela Vulcão GG num pote de terracota com pé alto', extra: ['O pote do Vulcão GG virado, como castiçal'] }),
  vela({ slug: 'vulcao-g', name: 'Vulcão G', acabamento: 'Terracota', medidas: '9 cm × 4,5 cm', peso: '122 g', price: 7000, stock: 1, mesa: 163, vira: true,
    alt: 'Vela Vulcão G num pote largo de terracota', extra: ['O pote do Vulcão G virado, como castiçal'] }),
  vela({ slug: 'vulcao-prata', name: 'Vulcão Mineral', acabamento: 'Terracota com esmalte de alta temperatura', medidas: '10,5 cm × 5 cm', peso: '160 g', price: 9000, stock: 1, mesa: 177, pavios: 2, vira: true,
    verso: 'Encaixe para vela de mergulho (vendida separadamente)',
    alt: 'Vela Vulcão Mineral, de dois pavios, num pote de terracota com esmalte preto e bronze', extra: ['O pote do Vulcão Mineral virado, como castiçal', 'O Vulcão Mineral como castiçal, com uma vela de mergulho'] }),
  vela({ slug: 'vulcao-verde', name: 'Vulcão Verde', acabamento: 'Terracota com esmalte de alta temperatura', medidas: '11 cm × 5 cm', peso: '169 g', price: 9000, stock: 1, mesa: 168, destaque: true, pavios: 2, vira: true,
    alt: 'Vela Vulcão Verde, de dois pavios, num pote de terracota com esmalte âmbar e verde', extra: ['O pote do Vulcão Verde virado, como castiçal'] }),

];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function isPurchasable(p: Product): boolean {
  return p.price > 0 && !p.sobEncomenda;
}

export function productsByCategory(category?: Category): Product[] {
  return category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;
}

export function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && value in CATEGORIES;
}

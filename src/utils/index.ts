export const formatNumber = (value: string | number) => {
  if (typeof value !== "number") {
    value = parseFloat(value); // Garante que seja um número
    if (isNaN(value)) return "0,00"; // Retorna um valor padrão em caso de erro
  }

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
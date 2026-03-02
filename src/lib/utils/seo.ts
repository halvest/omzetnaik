export const getMetadata = (title: string, description: string) => {
  return {
    title: `${title} | OmzetNaik.id`,
    description: description,
    openGraph: {
      images: ["/og-image.jpg"],
    },
  };
};

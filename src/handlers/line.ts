import { Category, Sort } from "domains/article";
import { container } from "providers";
import { Article } from "use-cases";

const useCase = container.get(Article);

export const Handler = async (): Promise<void> => {
  const categories = Object.values(Category);

  await Promise.all(
    categories.map(async (category) => {
      try {
        const catalog = await useCase.search({
          category,
          published: false,
          sort: Sort.CREATED_AT_ASC,
          items: 10,
        });

        if (catalog.count() !== 10) {
          return;
        }

        await useCase.publish(catalog);

        console.log(`Published ${category} articles.`);
      } catch (error) {
        console.error(`Failed to publish ${category} articles: reason ${error}`);
      }
    })
  );
};

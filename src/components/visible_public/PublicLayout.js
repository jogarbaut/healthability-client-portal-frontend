import PublicHeader from "./PublicHeader";
import PublicMain from "./PublicMain";
import PublicFooter from "./PublicFooter";

const PublicLayout = () => {
  const content = (
    <section className="public">
      <PublicHeader />
      <PublicMain />
      <PublicFooter />
    </section>
  );
  return content;
};

export default PublicLayout;

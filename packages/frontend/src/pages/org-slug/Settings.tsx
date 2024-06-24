import { Heading } from 'components/shared/Heading';

const Settings = () => {
  return (
    <section className="px-4 md:px-6 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center">
        <div className="grow">
          <div className="flex gap-4 items-center">
            <Heading as="h2" className="text-[24px]">
              Settings
            </Heading>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Settings;

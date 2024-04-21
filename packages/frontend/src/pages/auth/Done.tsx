import { Button } from 'components/shared/Button';
import {
  ArrowRightCircleFilledIcon,
  CheckRoundFilledIcon,
} from 'components/shared/CustomIcon';
import { WavyBorder } from 'components/shared/WavyBorder';

type Props = {
  continueTo: string;
};
export const Done = ({ continueTo }: Props) => {
  return (
    <div>
      <div className="self-stretch p-3 xs:p-6 flex-col justify-center items-center gap-5 flex">
        <div className="w-16 h-16 p-2 bg-sky-100 rounded-[800px] justify-center items-center gap-2 inline-flex">
          <CheckRoundFilledIcon />
        </div>
        <div>
          <div className="self-stretch text-center text-sky-950 text-2xl font-medium font-display leading-loose">
            You&apos;re in!
          </div>
          <div className="text-center text-slate-600 text-sm font-normal font-['Inter'] leading-tight">
            It's time to get your next project rolling!
          </div>
        </div>
      </div>
      <WavyBorder className="self-stretch" variant="stroke" />
      <div className="p-6 self-stretch flex flex-col gap-8">
        <Button
          as="a"
          rightIcon={<ArrowRightCircleFilledIcon />}
          className="self-stretch"
          href={continueTo}
          variant={'primary'}
        >
          Enter Snowball
        </Button>
      </div>
    </div>
  );
};

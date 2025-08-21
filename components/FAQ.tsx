import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {FAQDetails} from "@/data";

const FAQ = () => {
  return (
    <Accordion type="multiple" className="max-w-screen-lg mx-auto w-full pb-[10vh] px-4">
      <h1 className="font-bold text-2xl md:text-3xl lg:text-5xl">
        Frequently asked questions
      </h1>
      <h2 className="text-zinc-400 text-md md:text-lg lg:text-xl mt-4 mb-8">
        Can&apos;t find the answer you&apos;re looking for? Reach out to us and we&apos;ll get back to you as soon as possible.
      </h2>

      {FAQDetails.map((item) => {
        return (
          <AccordionItem value={item.value} key={item.value} className="sm:py-2">
            <AccordionTrigger className="text-lg sm:text-xl">{item.title}</AccordionTrigger>
            <AccordionContent className="text-md sm:text-lg text-zinc-400">{item.content}</AccordionContent>
          </AccordionItem>
        )
      })}

    </Accordion>
  )
}

export default FAQ;
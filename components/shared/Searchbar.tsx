import Form from "next/form";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import ResetForm from "./ResetForm";

interface Props {
  route: string;
  type: string;
  query: string
}

export default function Searchbar({query, route, type }: Props) {
  return (
    <Form
      action={route}
      className="searchbar"
    >
      <Search className="text-base-regular text-light-4" />
      <Input
        type="text"
        name="query"
        className="!bg-transparent border-none no-focus text-light-2"
        placeholder={`Search ${type}`}
        defaultValue={query}
      />
      <ResetForm query={query} route={route} />
    </Form>
  );
}

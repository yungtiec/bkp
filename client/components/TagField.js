import React from "react";
import { AsyncCreatable } from "react-select";
import TagChip from "./TagChip";
import axios from "axios";

const getTags = async (input, callback) => {
  input = input.toLowerCase();
  var tags = await axios
    .get("/api/tags/autocomplete", {
      params: { term: input }
    })
    .then(res => res.data);
  return { options: tags };
};

export default ({ handleOnSelect, handleRemoveTag, selectedTags, width, disabled }) => {
  return (
    <div className="tag-field">
      <AsyncCreatable
        multi={true}
        placeholder="add or create tag(s)"
        loadOptions={getTags}
        onChange={handleOnSelect}
        value={[]}
        style={width ? { width } : null}
        disabled={disabled}
        menuContainerStyle={width ? { width } : null}
      />
      <div className="tag-field__tags mt-2 mb-2">
        {selectedTags && selectedTags.length
          ? selectedTags.map((tag, index) => (
            <TagChip
              key={`tag__${tag.name}`}
              containerClassname="tag-field__tag dark-bg"
              tagValue={tag.name}
              closeIconOnClick={() => handleRemoveTag(index)}
            />
          ))
          : ""}
      </div>
    </div>
  );
}

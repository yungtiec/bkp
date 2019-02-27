import React from "react";
import { AsyncCreatable } from "react-select";
import TagChip from "./TagChip";

export default ({
  fetchTags,
  handleOnSelect,
  handleRemoveTag,
  selectedTags,
  width
}) => (
  <div>
    <AsyncCreatable
      multi={true}
      placeholder="add or create tag(s)"
      loadOptions={fetchTags}
      onChange={handleOnSelect}
      value={[]}
      style={width ? { width } : null}
      menuContainerStyle={width ? { width } : null}
    />
    <div className="comment-item__tags mt-2 mb-2">
      {selectedTags && selectedTags.length
        ? selectedTags.map((tag, index) => (
            <TagChip
              key={`comment-tag__${tag.name}`}
              containerClassname="comment-item__tag dark-bg"
              tagValue={tag.name}
              closeIconOnClick={() => handleRemoveTag(index)}
            />
          ))
        : ""}
    </div>
  </div>
);

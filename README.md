# Guides
This repository holds all the guides for Kabanero.io.  

Each new guide should be self-contained in its own directory. The directory's name should be the guides name.

## Work Flow

1. New Guides will create a directory under `draft`. The name of the directory should describe the Guide and not conflict with other Guide names.
1. Create a markdown file and name it the same as the guide's name (and directory name).
1. Write the Guide in markdown format.
1. Get the Guide reviewed (TODO: add review process).
1. Move the directory from the `draft` directory to the `publish` directory.

## Structure

- `archive`
   - Guides that are considered obsolete. Archived guides will never be published.
- `draft`
   - All draft guides. These will not be published. You no longer need to append `draft-guide` to the guide's name.
- `publish`
   - Guides that will be published.
- `templates`
   - Guide templates available to be used for new guides to follow. Templates are never published.

import { Box, Checkbox, Flex, Text } from '@sanity/ui';
import { useCallback } from 'react';
import { type ArrayOfPrimitivesInputProps, set, unset } from 'sanity';
import { SITES, type Site, type SiteName } from '../../lib/SITES';

export const SiteNameInput = (props: ArrayOfPrimitivesInputProps<string>) => {
  const { value, onChange } = props;

  const handleChange = useCallback(
    (siteName: SiteName) => {
      if (value?.includes(siteName)) {
        const newValues = value?.filter((name) => name !== siteName);

        if (newValues.length === 0) {
          onChange(unset());
        } else {
          onChange(set(newValues));
        }
      }
    },
    [onChange, value],
  );

  return (
    <Box>
      {SITES.map((site: Site) => {
        const isChecked = value?.includes(site.name) as boolean;

        return (
          <Flex key={site.name} as="label" align="center" style={{ border: site ? '1px solid' : '' }}>
            <Flex padding={3}>
              <Checkbox checked={isChecked} onChange={() => handleChange(site.name)} />
            </Flex>
            <Text>{site.title}</Text>
          </Flex>
        );
      })}
    </Box>
  );
};

import { Layout, List, Spinner, Text } from "@ui-kitten/components";
import React from "react";
import { StyleSheet } from "react-native";
import CatCardItem from "../components/cards/CatCardItem";
import useGetCats from "../hooks/useGetCats";
import useToggleFave from "../hooks/useToggleFave";

const CatList = () => {
  const {
    data,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    isFetched,
    hasNextPage,
  } = useGetCats();
  const toggleFaveMutation = useToggleFave();

  const loadMore = () => {
    fetchNextPage();
  };

  const toggleFave = (item) => {
    // const prevIsFave = isFave;
    // setIsFave(!prevIsFave);
    toggleFaveMutation.mutate(item, {
      onError: (error) => {
        // setIsFave(prevIsFave);
      },
    });
  };

  if (isLoading) {
    return (
      <Layout
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        accessibilityLabel="loading-spinner"
      >
        <Spinner size={"giant"} />
      </Layout>
    );
  }

  const Footer = () =>
    isFetchingNextPage && hasNextPage ? (
      <Layout style={styles.footer}>
        <Spinner status={"info"} size="giant" />
      </Layout>
    ) : hasNextPage ? null : (
      <Layout style={styles.footer}>
        <Text>No more cats to load</Text>
      </Layout>
    );

  const renderItem = ({ item, index }) => (
    <CatCardItem
      toggleFave={() => toggleFave(item)}
      index={index}
      item={item}
    />
  );

  return (
    <List
      testID="cat-list"
      keyExtractor={(item) => item?.id}
      data={data?.pages.map((page) => page.data).flat()}
      renderItem={renderItem}
      ListFooterComponent={Footer}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      removeClippedSubviews={true}
      extraData={isFetched}
      showsVerticalScrollIndicator={false}
      maxToRenderPerBatch={8}
      windowSize={11}
      initialNumToRender={8}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
});

export default CatList;
